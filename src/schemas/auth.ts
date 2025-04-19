import { z } from 'zod';

const RegisterSchema = z
  .object({
    username: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    last_name: z.string().min(3, 'Sobrenome deve ter no mínimo 3 caracteres'),
    email: z
    .string()
    .email('Email inválido')
    .refine(
        (email) => {
            const domain = email.split('@')[1];
            return domain === 'gmail.com' || domain === 'hotmail.com' || domain === 'outlook.com';
        },
        {
            message: 'Email deve ser de um domínio gmail ou yahoo',
        }
    ),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    password2: z.string().min(6, 'Confirmação de senha deve ter no mínimo 6 caracteres'),
    user_type: z.enum(['student', 'advisor']),
  })
  .refine((data) => data.password === data.password2, {
    message: 'As senhas não coincidem',
    path: ['password2'],
  });






const LoginSchema = z.object({
  username: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export  { RegisterSchema, LoginSchema };
