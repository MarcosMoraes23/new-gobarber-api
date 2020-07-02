interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'marcosmoraes2303@gmail.com',
      name: 'Marcos Moraes',
    },
  },
} as IMailConfig;
