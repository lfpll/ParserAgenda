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
mongoose.connect('mongodb://writer:VegVH0Dfa9nLzEse@cluster0-shard-00-00-ig3pl.mongodb.net:27017,cluster0-shard-00-01-ig3pl.mongodb.net:27017,cluster0-shard-00-02-ig3pl.mongodb.net:27017/CarOne?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');


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
//Lista of the links with the first pattern
var lstPttn1 =[{
  nome: 'Ministro-chefe da Casa Civil, Eliseu Padilha',
  site: 'http://www.casacivil.gov.br/ministro/agenda-do-ministro/',
  titulo: 'Casa Civil'
}, {
  nome: 'Odilson Luiz Ribeiro e Silva',
  site: 'http://www.agricultura.gov.br/acesso-a-informacao/institucional/pasta-de-agendas-de-autoridades/agenda-do-secretario-de-relacoes-internacionais-do-agronegocio/',
  titulo: 'Ministério da Agricultura, Pecuária e Abastecimento'
}, {
  nome: 'Presidente Michel Temer',
  site: 'http://www2.planalto.gov.br/acompanhe-planalto/agenda-do-presidente/agenda-do-presidente-michel-temer/',
  titulo: 'Presidência da República'
}, {
  nome: 'Blairo Borges Maggi',
  site: 'http://www.agricultura.gov.br/acesso-a-informacao/institucional/pasta-de-agendas-de-autoridades/agenda-do-ministro/',
  titulo: 'Ministério da Agricultura, Pecuária e Abastecimento'
}, {
  nome: 'José Rodrigues Pinheiro Dória',
  site: 'http://www.agricultura.gov.br/acesso-a-informacao/institucional/pasta-de-agendas-de-autoridades/agenda-do-secretario-de-mobilidade-social-do-produtor-rural-e-do-cooperativismo/',
  titulo: 'Ministério da Agricultura, Pecuária e Abastecimento'
}, {
  nome: 'Neri Geller',
  site: 'http://www.agricultura.gov.br/acesso-a-informacao/institucional/pasta-de-agendas-de-autoridades/agenda-do-secretario-de-politica-agricola/',
  titulo: 'Ministério da Agricultura, Pecuária e Abastecimento'
}, {
  nome: 'Eumar Roberto Novacki',
  site: 'http://www.agricultura.gov.br/acesso-a-informacao/institucional/pasta-de-agendas-de-autoridades/agenda-do-secretario-executivo/',
  titulo: 'Ministério da Agricultura, Pecuária e Abastecimento'
}, {
  nome: 'Luís Eduardo Pacifici Rangel',
  site: 'http://www.agricultura.gov.br/acesso-a-informacao/institucional/pasta-de-agendas-de-autoridades/agenda-do-secretario-de-defesa-agropecuaria/',
  titulo: 'Ministério da Agricultura, Pecuária e Abastecimento'
}]

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
						console.log(lnkFnal)
						try{
						var hor = []
						if(err){
							console.log(err)
						}
						else 
						{ 

							var $ = cheerio.load(body)
							$("li.item-compromisso").each(function()
					    	{
					    		var horario = $(this).find('.comprimisso-horarios').text()
					    		console.log('o horario é' + typeof(horario))
					    		console.log('data do horario' +horario)
					    		var finalHorario = horario.match(/[0-9][0-9]h[0-9][0-9]/g)
					       		var compromisso = $(this).find('.comprimisso-titulo').text()             
					       		var data = {'time':finalHorario,'compromisso':compromisso}
					       		hor.push(data)
					    	});
					    	var compr = {'nome':data.nome, 'horarios':hor, 'titulo':data.titulo}
					    	lstFnal.push(compr)
					    	count++
					    	console.log(count)
					    	
						if(count==lstPttn1.length)
					    	{

					    		var obj = {"_id":date.day+date.year+date.month,'date':date, 'politicians': lstFnal}
					    		Agenda.create(obj,function(err,insDate)
					    		{
					    			if(err)
					    			{
					    				console.log(err)
					    			};
					    			res.redirect("dateAgenda/"+date.day+date.year+date.month)
					    		});
					    	};
					    	
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
