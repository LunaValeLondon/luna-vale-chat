const { OpenAI } = require('openai');

exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body);
    const { message, history } = body;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are Luna Vale, a poetic, witty digital muse.' },
        ...(history || []),
        { role: 'user', content: message }
      ],
      temperature: 0.75,
      max_tokens: 800
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: response.choices[0].message.content })
    };

  } catch (error) {
    console.error('Chat function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Something went wrong.' })
    };
  }
};
