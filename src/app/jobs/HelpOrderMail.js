import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class HelpOrderMail {
  get key() {
    return 'HelpOrderMail';
  }

  async handle({ data }) {
    const { help_order, student } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Resposta a pedido de Auxilio',
      template: 'help-order',
      context: {
        student: student.name,
        date: format(
          parseISO(help_order.created_at),
          "'dia' dd 'de' MMMM', ás' H:mm'h'",
          {
            locale: pt,
          }
        ),
        question: help_order.question,
        answer: help_order.answer,
      },
    });
  }
}

export default new HelpOrderMail();
