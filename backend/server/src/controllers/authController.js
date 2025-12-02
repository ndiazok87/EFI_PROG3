import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User, Profile, PasswordReset } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || null;

function validatePassword(password) {
  if (typeof password !== 'string') return 'Contraseña inválida';
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
  if (!/[A-Z]/.test(password)) return 'La contraseña debe contener al menos una letra mayúscula';
  if (!/[0-9]/.test(password)) return 'La contraseña debe contener al menos un número';
  return null;
}

export const signUp = async (req, res) => {
  try {
  const { email, password, nombre, rol = 'trabajador' } = req.body;
  if (!email || !password || !nombre) return res.status(400).json({ message: 'Faltan campos' });

  const pwErr = validatePassword(password);
  if (pwErr) return res.status(400).json({ message: pwErr });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email ya registrado' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password_hash, raw_user_meta_data: { nombre, rol } });

    // create profile with same id
    await Profile.create({ id: user.id, nombre, correo: email, rol });

    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    console.error('signUp error:', err);
    res.status(500).json({ message: 'Error en registro' });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Faltan campos' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ access_token: token, token_type: 'bearer', expires_in: 7 * 24 * 3600 });
  } catch (err) {
    console.error('signIn error:', err);
    res.status(500).json({ message: 'Error en autenticación' });
  }
};

export const me = async (req, res) => {
  try {
    const userId = req.userId;
    const profile = await Profile.findByPk(userId);
    if (!profile) return res.status(404).json({ message: 'Perfil no encontrado' });
    res.json(profile);
  } catch (err) {
    console.error('me error:', err);
    res.status(500).json({ message: 'Error' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email requerido' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(200).json({ message: 'Si el email existe, se enviará un enlace' });

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hora
    await PasswordReset.create({ user_id: user.id, token, expires_at: expiresAt });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    if (SENDGRID_API_KEY) {
      // dynamic import so package is only required when actually used
      try {
        const sg = await import('@sendgrid/mail');
        const sgClient = sg.default || sg;
        sgClient.setApiKey(SENDGRID_API_KEY);
        const msg = {
          to: email,
          from: process.env.SENDGRID_FROM || 'no-reply@example.com',
          subject: 'Restablecer contraseña',
          text: `Usa este enlace para restablecer tu contraseña: ${resetUrl}`,
          html: `<p>Usa este enlace para restablecer tu contraseña:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
        };
        await sgClient.send(msg);
      } catch (e) {
        console.error('SendGrid send failed or package not installed:', e);
        console.log('Reset URL (failed to send with SendGrid):', resetUrl);
      }
    } else {
      console.log('Reset URL (no SendGrid configured):', resetUrl);
    }

    res.json({ message: 'Si el email existe, se ha enviado un enlace de restablecimiento' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    res.status(500).json({ message: 'Error al procesar solicitud' });
  }
};

export const resetPassword = async (req, res) => {
  try {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: 'Token y contraseña requeridos' });

  const pwErr = validatePassword(password);
  if (pwErr) return res.status(400).json({ message: pwErr });

    const record = await PasswordReset.findOne({ where: { token } });
    if (!record) return res.status(400).json({ message: 'Token inválido' });
    if (record.used) return res.status(400).json({ message: 'Token ya utilizado' });
    if (new Date(record.expires_at) < new Date()) return res.status(400).json({ message: 'Token expirado' });

    const user = await User.findByPk(record.user_id);
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const password_hash = await bcrypt.hash(password, 10);
    await user.update({ password_hash, updated_at: new Date() });
    await record.update({ used: true });

    res.json({ message: 'Contraseña restablecida correctamente' });
  } catch (err) {
    console.error('resetPassword error:', err);
    res.status(500).json({ message: 'Error al restablecer contraseña' });
  }
};
