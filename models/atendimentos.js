const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const atendimentos = require('../controllers/atendimentos');

class Atendimentos{
    adiciona(atendimento, res){
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');
        
        const dataEhValida = moment(data).isSameOrAfter(dataCriacao);
        const clienteEhValido = atendimento.cliente.length >= 5;
        
        const validacoes = [
            {
                nome: "data",
                valido: dataEhValida,
                mensagem: "Data deve ser maior ou igual a data de criação de atendimento."
            },
            {
                nome: "cliente",
                valido: clienteEhValido,
                mensagem: "Cliente deve ter no minimo 5 caracteres."
            }
        ];
        
        const erros = validacoes.filter(campo => !campo.valido);
        const existemErros = erros.length;
        
        if(existemErros){
            res.status(400).json(erros);
        }else{
            const atendimentoDatado = {...atendimento, dataCriacao, data};
            
            const sql = `INSERT INTO Atendimentos SET ?`;
            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
                if(erro){
                    res.status(400).json(erro);
                }else{
                    res.status(201).json(atendimento);
                }
            });

        }
    }

    lista(){
        const sql = `SELECT * FROM Atendimentos`;

        conexao.query(sql, (erro, resultados) => {
            if(erro){
                res.status(400).json(resultados);
            }else{
                res.status(200).json(resultados);
            }
        });
    }

    buscaId(id, res){
        const sql = `SELECT * FROM Atendimentos id=${id}`;

        conexao.query(sql, (erro, resultados) => {
            const atendimento = resultados[0];
            if(erro){
                res.status(400).json(erro);
            }else{
                res.status(200).json(atendimento);
            }
        });
    }

    altera(id, valores, res){
        const sql = `UPDATE Atendimentos SET ? where id=?`;
        if(valores.data){
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');
        }

        conexao.query(sql, [valores, id], (erro,resultados) => {
            if(erro){
                res.status(400).json(erro);
            }else{
                res.status(200).json(valores);
            }
        });
    }

    deleta(id, res){
        const sql = `DELETE FROM Atendimentos WHERE id=?`;

        conexao.query(sql, id, (erro, resultados) => {
            if(erro){
                res.status(400).json(erro);
            }else{
                res.status(200).json({id});
            }
        });
    }
}

module.exports = new Atendimentos;