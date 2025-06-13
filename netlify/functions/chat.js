const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message, history } = JSON.parse(event.body);

    const messages = [
      { role: 'system', content: 'You are Luna Vale, a poetic, witty assistant.' },
      ...(history || []),
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.75,
      max_tokens: 800
    });

    const reply = response.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (err) {
    console.error('OpenAI error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Something went wrong.' })
    };
  }
};
