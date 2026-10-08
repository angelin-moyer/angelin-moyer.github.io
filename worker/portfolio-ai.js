// Deploy this file as a Cloudflare Worker with secret OPENAI_API_KEY.
// Configure MODEL to an available model and set allowed origin to your portfolio.
const ORIGIN = 'https://angelin-moyer.github.io';
const BACKGROUND = `You are Angelin Moyer's friendly portfolio assistant. Answer open-ended questions conversationally, including general questions, without pretending to be Angelin. When asked about Angelin, stick to these verified facts: University of Colorado Boulder B.S. Information Science, Business minor, Google Advanced Data Analytics certificate. Work: AI Strategy Fellow at Call for Code AI collaborating across product/technical/partner teams; Team Lead at OZO Coffee. Projects: Smoking Prevalence interactive data visualization on demographics and geography; BalanceBasket grocery/budgeting capstone (backend FastAPI, SQLite, SQLAlchemy, AI assistant with budget/pantry/dietary context); LLM evaluation harness on pass rate, refusal accuracy, hallucination and consistency; semantic search quality with Ollama/embeddings/RAG. Skills: SQL, Python, Pandas, Tableau, Power BI, FastAPI, ML and NLP. Location displayed: Denver, Colorado. Interested in analytics, BI and applied AI. Avoid inventing employment, accomplishments, specific metrics, or intimate personal details. Say when you do not know personal facts. Encourage emailing her for hiring inquiries at angiemoyer14@gmail.com.`;
export default {
 async fetch(request, env) {
  const headers = {'Access-Control-Allow-Origin':ORIGIN,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin','Content-Type':'application/json'};
  const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(request.method!=='POST')return json({error:'Method not allowed'},405);
  if(request.headers.get('Origin')!==ORIGIN)return json({error:'Origin not allowed'},403);
  if(!env.OPENAI_API_KEY)return json({error:'AI service not configured'},503);
  const size=Number(request.headers.get('content-length')||0);
  if(size>16000)return json({error:'Request too large'},413);
  let body;try{body=await request.json()}catch{return json({error:'Invalid JSON'},400)}
  const messages=Array.isArray(body.messages)?body.messages.slice(-12):[];
  if(!messages.length)return json({error:'Missing messages'},400);
  const safe=messages.filter(m=>m && ['user','assistant'].includes(m.role)&&typeof m.content==='string').map(m=>({role:m.role,content:m.content.slice(0,1500)}));
  if(!safe.length||safe[safe.length-1].role!=='user')return json({error:'Missing user question'},400);
  if(safe.reduce((n,m)=>n+m.content.length,0)>14000)return json({error:'Conversation too long'},413);
  try{
   const upstream=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Authorization':'Bearer '+env.OPENAI_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({model:env.MODEL||'gpt-4.1-mini',instructions:BACKGROUND,input:safe,max_output_tokens:350,store:false})});
   if(!upstream.ok)return json({error:'Model service unavailable'},502);
   const result=await upstream.json();
   const answer=(result.output||[]).filter(o=>o.type==='message').flatMap(o=>o.content||[]).filter(c=>c.type==='output_text').map(c=>c.text).join('\n').trim();
   return answer?json({answer}):json({error:'No answer returned'},502);
  }catch{return json({error:'Chat request failed'},502)}
 }
};