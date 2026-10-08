// Cloudflare Workers Free + Workers AI binding. No API key, no paid OpenAI API.
// Configure the AI binding in the Cloudflare dashboard with variable name AI.
const ORIGIN='https://angelin-moyer.github.io';
const SYSTEM=`You are a friendly AI guide on Angelin Moyer's public portfolio. Answer any reasonable question conversationally. For questions about Angelin, use these confirmed professional facts only: Angelin is an Information Science graduate of the University of Colorado Boulder with a Business minor and Google Advanced Data Analytics Professional Certificate. She is located in Denver, Colorado. Her work includes an AI Strategy Fellowship at Call for Code AI (cross-functional requirements and technical/product collaboration) and team leadership at OZO Coffee. Her projects include BalanceBasket (AI grocery/budgeting capstone; backend FastAPI, SQLite/SQLAlchemy, context-aware assistant), Smoking Prevalence data visualizations exploring demographics and geography, an LLM Evaluation Harness comparing models using structured prompts and quality metrics, and Search Quality Evaluation using embeddings, semantic retrieval, Ollama and RAG. Skills include SQL, Python, Pandas, Tableau, Power BI, FastAPI, scikit-learn, data visualization, applied AI. She is interested in data analysis, BI, and applied AI. Her professional contact is angiemoyer14@gmail.com and LinkedIn is linkedin.com/in/angelin-moyer. Do not invent personal facts or results. If you do not know something specific about Angelin, say so and suggest contacting her. Do not pretend to be Angelin. Keep answers typically under 180 words. General questions outside her portfolio can be answered too.`;
export default {
 async fetch(req,env) {
  const headers={'Access-Control-Allow-Origin':ORIGIN,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin','Content-Type':'application/json'};
  const reply=(o,status=200)=>new Response(JSON.stringify(o),{status,headers});
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(req.method!=='POST')return reply({error:'Method not allowed'},405);
  if(req.headers.get('Origin')!==ORIGIN)return reply({error:'Origin not allowed'},403);
  if(!env.AI)return reply({error:'Workers AI binding not configured'},503);
  if(Number(req.headers.get('content-length')||0)>16000)return reply({error:'Request too large'},413);
  let body;try{body=await req.json()}catch{return reply({error:'Invalid JSON'},400)}
  const input=Array.isArray(body.messages)?body.messages.slice(-10):[];
  const safe=input.filter(m=>m && ['user','assistant'].includes(m.role)&&typeof m.content==='string').map(m=>({role:m.role,content:m.content.slice(0,1000)}));
  if(!safe.length||safe[safe.length-1].role!=='user')return reply({error:'Last message must be a question'},400);
  if(safe.reduce((n,m)=>n+m.content.length,0)>8500)return reply({error:'Conversation too long'},413);
  try {
   const response=await env.AI.run('@cf/zai-org/glm-4.7-flash',{messages:[{role:'system',content:SYSTEM},...safe],max_tokens:400,temperature:0.4});
   const answer=typeof response.response==='string'?response.response.trim():'';
   return answer?reply({answer}):reply({error:'No answer returned'},502);
  }catch(err){return reply({error:'Free AI temporarily unavailable or daily limit reached'},503)}
 }
};