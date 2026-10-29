import test from 'node:test';
import assert from 'node:assert/strict';
import {buildQuoteMessages} from '../src/quote-messages.mjs';
const data={service:'Desarrollo Web',goal:'Captar contactos',question:'¿Tienes una web actualmente?',answer:'No, empezaré de cero',plan:{name:'Landing',price:'$120.000',billing:'CLP + IVA · Pago único',note:'Autoadministrable, capacitación y 3 meses de hosting gratis.'},name:'Ana Pérez',email:'ana@example.com',company:'Mi empresa',phone:'+56 9 1234 5678',brief:'Quiero renovar mi web.\n\nNecesito un formulario y una galería.'};
test('Messages separate contact, project, plan and the customer brief; subject identifies customer and service',()=>{
 const messages=buildQuoteMessages(data);
 assert.match(messages.subject,/Desarrollo Web \/ Landing · Ana Pérez/);
 for(const value of ['Ana Pérez','ana@example.com','$120.000','CLP + IVA · Pago único','3 meses de hosting gratis',data.brief]){
  assert.ok(messages.emailBody.includes(value));assert.ok(messages.whatsapp.includes(value));
 }
 assert.match(messages.whatsapp,/\*01 · DATOS DE CONTACTO\*\n\*Nombre:\*/);
 assert.match(messages.emailBody,/03 · PLAN Y VALOR\nPlan: Landing/);
 assert.ok(!messages.emailBody.includes('*Nombre:*'));
 assert.ok(messages.emailBody.indexOf('01 · DATOS')<messages.emailBody.indexOf('02 · SERVICIO'));
});
test('Help inquiries omit plan and price sections and use an appropriate subject',()=>{
 const messages=buildQuoteMessages({...data,service:'Necesito orientación',isHelp:true,plan:undefined,phone:'',company:''});
 assert.match(messages.subject,/Consulta y orientación/);
 assert.match(messages.whatsapp,/NUEVA CONSULTA/);
 assert.ok(!messages.emailBody.includes('PLAN Y VALOR'));
 assert.ok(!messages.whatsapp.includes('PLAN Y VALOR'));
 assert.match(messages.emailBody,/WhatsApp: No indicado/);
 assert.match(messages.emailBody,/03 · MENSAJE DEL CLIENTE/);
});
