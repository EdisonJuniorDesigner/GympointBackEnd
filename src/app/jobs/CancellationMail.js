import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { enrollment } = data;

    // console.log('A fila executou');

    await Mail.sendMail({
      to: `${enrollment.student.name} <${enrollment.student.email}>`,
      subject: 'Matrícula cancelada',
      template: 'cancellation',
      context: {
        student: enrollment.student.name,
        title: enrollment.plan.title,
        duration: enrollment.plan.duration,
        price: enrollment.plan.price,
      },
    });
  }
}

export default new CancellationMail();
