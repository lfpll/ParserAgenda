var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var app = express();
var bodyParser 	= require('body-parser');

process.setMaxListeners(0);
app.get('/',function(req,res){
	res.render('index.ejs')
});
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
//Lista of the links with the first pattern

var headers = { 
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
    'Content-Type' : 'application/x-www-form-urlencoded' 
};

var dateSchema = new mongoose.Schema
({
	_id: String,
	date: Object,
	politicians: Array
});
var Agenda 	= mongoose.model('Agenda',dateSchema)

var lstPttn1 =['http://www.casacivil.gov.br/ministro/agenda-do-ministro ','http://www.agricultura.gov.br/acesso-a-informacao/institucional/pasta-de-agendas-de-autoridades/agenda-do-ministro','http://www.agricultura.gov.br/acesso-a-informacao/institucional/pasta-de-agendas-de-autoridades/agenda-do-secretario-executivo','http://www.agricultura.gov.br/acesso-a-informacao/institucional/pasta-de-agendas-de-autoridades/agenda-do-secretario-de-defesa-agropecuaria','http://www.agricultura.gov.br/acesso-a-informacao/institucional/pasta-de-agendas-de-autoridades/agenda-do-secretario-de-politica-agricola','http://www.agricultura.gov.br/acesso-a-informacao/institucional/pasta-de-agendas-de-autoridades/agenda-do-secretario-de-mobilidade-social-do-produtor-rural-e-do-cooperativismo','http://www.agricultura.gov.br/acesso-a-informacao/institucional/pasta-de-agendas-de-autoridades/agenda-do-secretario-de-relacoes-internacionais-do-agronegocio','http://www.mdic.gov.br/index.php/agenda?view=autoridade&id=1&dia=2017-05-03  ','http://www.mdic.gov.br/index.php/agenda?view=autoridade&id=113&dia=2017-05-03  ','http://www.mdic.gov.br/index.php/agenda?view=autoridade&id=95&dia=2017-05-03','http://www.mdic.gov.br/index.php/agenda?view=autoridade&id=92&dia=2017-05-03','http://www.mdic.gov.br/index.php/agenda?view=autoridade&id=14&dia=2017-05-03','http://www.mdic.gov.br/index.php/agenda?view=autoridade&id=13&dia=2017-05-03','http://www.transportes.gov.br/agendas.html?view=autoridade&id=38&dia=2017-05-03','http://www.transportes.gov.br/agendas.html?view=autoridade&id=36&dia=2017-05-03','http://www.mdic.gov.br/index.php/agenda?view=autoridade&amp;dia=2017-05-03&amp;id=86','http://www.itamaraty.gov.br/pt-BR/component/agendadirigentes/?view=autoridade&id=16','http://www.cultura.gov.br/agenda-do-ministro','http://www.cultura.gov.br/agenda-secretaria-de-fomento-e-incentivo-a-cultura ','http://www.defesa.gov.br/index.php/agenda-de-autoridades/agenda-do-ministro','http://www.itamaraty.gov.br/pt-BR/o-ministro-e-demais-autoridades/secretario-geral-das-relacoes-exteriores/643-secretario-geral-das-relacoes-exteriores','http://www.itamaraty.gov.br/pt-BR/o-ministro-e-demais-autoridades/subsecretaria-geral-de-assuntos-economicos-e-financeiros/648-subsecretaria-geral-de-assuntos-economicos-e-financeiros-sgef','http://www.itamaraty.gov.br/pt-BR/o-ministro-e-demais-autoridades/subsecretaria-geral-politica-iii/657-subsecretario-geral-da-africa-e-do-oriente-medio','http://www.itamaraty.gov.br/pt-BR/o-ministro-e-demais-autoridades/subsecretaria-geral-da-america-do-sul-central-e-do-caribe/659-subsecretario-geral-da-america-latina-e-do-caribe','http://www.itamaraty.gov.br/pt-BR/o-ministro-e-demais-autoridades/subsecretaria-geral-politica-i/654-subsecretario-geral-de-assuntos-politicos-multilaterais-europa-e-america-do-norte','http://www.itamaraty.gov.br/pt-BR/o-ministro-e-demais-autoridades/subsecretaria-geral-de-cooperacao-cultura-e-promocao-comercial/661-subsecretario-geral-de-cooperacao-internacional-promocao-comercial-e-temas-culturais','http://www.itamaraty.gov.br/pt-BR/o-ministro-e-demais-autoridades/subsecretaria-geral-de-meio-ambiente-energia-ciencia-e-tecnologia/653-subsecretaria-geral-de-meio-ambiente-energia-ciencia-e-tecnologia-sgaet','http://www.itamaraty.gov.br/pt-BR/o-ministro-e-demais-autoridades/secretaria-executiva-da-camex/14572-secretaria-executiva-da-camex','http://www.bcb.gov.br/pt-br/#!/c/LAIAGENDA/','http://www.mme.gov.br/web/guest/acesso-a-informacao/institucional/agenda-de-autoridades?p_p_id=8&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_8_tabs1=summary&_8_month=4&_8_day=3&_8_year=2017','http://www.mme.gov.br/web/guest/acesso-a-informacao/institucional/agenda-de-autoridades?p_p_id=8&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_8_struts_action=%2Fcalendar%2Fview_event&_8_redirect=http%3A%2F%2Fwww.mme.gov.br%2Fweb%2Fguest%2Facesso-a-informacao%2Finstitucional%2Fagenda-de-autoridades%3Fp_p_id%3D8%26p_p_lifecycle%3D0%26p_p_state%3Dnormal%26p_p_mode%3Dview%26p_p_col_id%3Dcolumn-1%26p_p_col_count%3D1&_8_eventId=13542297','http://www.mme.gov.br/web/guest/acesso-a-informacao/institucional/agenda-de-autoridades?p_p_id=8&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_8_struts_action=%2Fcalendar%2Fview_event&_8_redirect=http%3A%2F%2Fwww.mme.gov.br%2Fweb%2Fguest%2Facesso-a-informacao%2Finstitucional%2Fagenda-de-autoridades%3Fp_p_id%3D8%26p_p_lifecycle%3D0%26p_p_state%3Dnormal%26p_p_mode%3Dview%26p_p_col_id%3Dcolumn-1%26p_p_col_count%3D1&_8_eventId=13542309','http://www.mme.gov.br/web/guest/acesso-a-informacao/institucional/agenda-de-autoridades?p_p_id=8&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_8_struts_action=%2Fcalendar%2Fview_event&_8_redirect=http%3A%2F%2Fwww.mme.gov.br%2Fweb%2Fguest%2Facesso-a-informacao%2Finstitucional%2Fagenda-de-autoridades%3Fp_p_id%3D8%26p_p_lifecycle%3D0%26p_p_state%3Dnormal%26p_p_mode%3Dview%26p_p_col_id%3Dcolumn-1%26p_p_col_count%3D1&_8_eventId=13542303','http://www.mme.gov.br/web/guest/acesso-a-informacao/institucional/agenda-de-autoridades?p_p_id=8&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_8_struts_action=%2Fcalendar%2Fview_event&_8_redirect=http%3A%2F%2Fwww.mme.gov.br%2Fweb%2Fguest%2Facesso-a-informacao%2Finstitucional%2Fagenda-de-autoridades%3Fp_p_id%3D8%26p_p_lifecycle%3D0%26p_p_state%3Dnormal%26p_p_mode%3Dview%26p_p_col_id%3Dcolumn-1%26p_p_col_count%3D1&_8_eventId=13542537','http://www.fazenda.gov.br/assuntos/agenda/agenda-do-ministro','http://www.fazenda.gov.br/assuntos/agenda/secretario-de-acompanhamento-economico/2017-05-03?month:int=5&year:int=2017','http://www.fazenda.gov.br/assuntos/agenda/secretario-de-politica-economica/2017-05-03?month:int=5&year:int=2017','http://www.fazenda.gov.br/assuntos/agenda/secretario-de-assuntos-internacionais/2017-05-03?month:int=5&year:int=2017','http://mma.gov.br/component/agendadedirigentes/dirigente/18','http://www.mma.gov.br/component/agendadedirigentes/dirigente/21','http://www.mma.gov.br/component/agendadedirigentes/dirigente/23','http://www.mma.gov.br/component/agendadedirigentes/dirigente/20','http://www.mma.gov.br/component/agendadedirigentes/dirigente/24','http://portalsaude.saude.gov.br/index.php/cidadao/principal/agenda-das-autoridades/agenda/day.listevents/?category_fv=1260','http://portalsaude.saude.gov.br/index.php/cidadao/principal/agenda-das-autoridades/agenda/day.listevents/?category_fv=1264','http://portalsaude.saude.gov.br/index.php/cidadao/principal/agenda-das-autoridades/agenda/day.listevents/?category_fv=1191','http://portalsaude.saude.gov.br/index.php/cidadao/principal/agenda-das-autoridades/agenda/day.listevents/?category_fv=1121','http://portalsaude.saude.gov.br/index.php/cidadao/principal/agenda-das-autoridades/agenda/day.listevents/?category_fv=1217','http://portalsaude.saude.gov.br/index.php/cidadao/principal/agenda-das-autoridades/agenda/day.listevents/?category_fv=1285','http://www.ans.gov.br/externo/site_novo/agenda_autoridades/agenda.asp','http://www.inpi.gov.br/sobre/agenda/presidente','http://www.inpi.gov.br/sobre/agenda/agenda/2017-05-03?month:int=5&year:int=2017','http://www.inpi.gov.br/sobre/agenda/diretor-de-marcas/2017-05-03?month:int=5&year:int=2017','http://www.inpi.gov.br/sobre/agenda/diretor-de-patentes/2017-05-03?month:int=5&year:int=2017','http://www2.mcti.gov.br/index.php/agenda-do-ministro','http://www.mct.gov.br/index.php/content/view/338817/Secretaria_Executiva.html','http://www.mct.gov.br/index.php/content/view/338818/Secretario_de_Politicas_e_Programas_de_Pesquisa_e_Desenvolvimento.html','http://www.mct.gov.br/index.php/content/view/338821/Secretario_de_Politica_de_Informatica.html','http://www2.mcti.gov.br/index.php/imprensa/agendas/secretaria-de-inclusao-digital-sid/agenda-do-secretario-de-inclusao-digital','http://www.mct.gov.br/index.php/content/view/338820/Secretario_de_Desenvolvimento_Tecnologico_e_Inovacao.html','http://www.planejamento.gov.br/agendas-de-autoridades','http://www.planejamento.gov.br/agendas-de-autoridades/seain','http://trabalho.gov.br/agenda-do-trabalho/agenda-ministro-do-trabalho','http://trabalho.gov.br/agenda-do-trabalho/agenda-secretario-executivo','http://trabalho.gov.br/agenda-do-trabalho/agenda-secretario-de-inspecao-do-trabalho','http://www.anp.gov.br/agenda-da-diretoria','http://www.epe.gov.br/acessoainformacao/Paginas/AgendaPRD.aspx','http://www.epe.gov.br/acessoainformacao/Paginas/agendadea.aspx','http://www.epe.gov.br/acessoainformacao/Paginas/agendadee.aspx','http://www.epe.gov.br/acessoainformacao/Paginas/agendadgc.aspx','http://www.epe.gov.br/acessoainformacao/Paginas/agendadpg.aspx','http://www.aneel.gov.br/agenda-dos-agentes-publicos','http://portal.antaq.gov.br/index.php/acesso-a-informacao/agenda-de-autoridades/','http://www.ibama.gov.br/component/jumi/?view=application&ag=29&Itemid=421']

app.post('/dateAgenda',function(req,res){
	var count = 0
	var lstFnal = []
	console.log("foi")
	var date = req.body.date
	Agenda.findById(date.day+date.year+date.month,function(err,obj){
		if(err){			
		}
		else{
			if(obj!= null){
				console.log(obj)
				res.redirect('dateAgenda/'+obj._id)
			}
			else{
				var datReq = (date.year+'-'+date.month+'-'+date.day+'?month:int=3&year:int='+date.year);// IF ERROR ON PAGE, MINISTER DON'T HAVE APOINTMENTS
				lstPttn1.forEach(function(data){
				//Final link with date pattern
					var lnkFnal = data.site + datReq;
					request.get({url:lnkFnal, headers:headers},function(error,response,body)
					{
					    	var compr = {'nome':data.nome, 'horarios':hor, 'titulo':data.titulo}
					    	lstFnal.push(compr)
					    	count++
					    	console.log(count)
					    	
						};
					}
					catch(err){
						console.log(err)
					}
					});
				});
			}
		}
	})

});
	
app.get('/dateAgenda/:id',function(req,res){
	console.log(req.params.id)
	Agenda.findById(req.params.id,function(err,user){
		if(err)
		{}
		else
		{
		res.render('test', {agenda:user.politicians});
		}
	})
	
})


var port = process.env.PORT || 8080
app.listen(port,function(){
    console.log('Working Server.')
})

/*	    	AgendaSch.find({date1:date},function(err,sucess){
	    		if(err){
	    			console.log(err)
	    		}
	    		else
	    		{
	    			console.log('sucessao')
	    		}
	    	})*/
