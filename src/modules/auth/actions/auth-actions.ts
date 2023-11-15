import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import AuthService from '../services/auth-service';

const prisma = new PrismaClient();

async function createAccount(formData: FormData) {
  'use server';

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const hashPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  redirect('/portal/login');
}

async function login(formData: FormData) {
  'use server';

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    // Aqui você pode usar optimistic update para atualizar a tela
    console.log('Error');
    redirect('/portal/login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    console.log('Usuário ou senha inválidos');
    redirect('/portal/login');
  }

  await AuthService.createSessionToken({
    sub: user.id,
    name: user.name,
    email: user.email,
  });

  redirect('/portal');
}

const AuthActions = {
  createAccount,
  login,
};

export default AuthActions;
