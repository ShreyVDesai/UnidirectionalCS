import AWS from 'aws-sdk';

AWS.config.update({ region: process.env.AWS_REGION });

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

export const sendEmail = async (to: string, subject: string, body: string) => {
  if (!process.env.SES_EMAIL) {
    // fallback: print to console (useful during testing if SES isn't set)
    console.warn('SES_EMAIL not configured — printing email to console instead of sending');
    console.log('EMAIL TO:', to);
    console.log('SUBJECT:', subject);
    console.log('BODY:', body);
    return;
  }

  const params = {
    Destination: { ToAddresses: [to] },
    Message: {
      Body: { Text: { Charset: 'UTF-8', Data: body } },
      Subject: { Charset: 'UTF-8', Data: subject }
    },
    Source: process.env.SES_EMAIL
  };

  return ses.sendEmail(params).promise();
};
