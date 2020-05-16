const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const usuarios = await connection('usuarios').select('*');

        return response.json(usuarios);
    },

    async create(request, response) {
        const { name, doc, cep, rua, bairro, cidade, estado, numero, complemento, nascimento, telefone, type, email, senha } = request.body;
        const id = crypto.randomBytes(4).toString('HEX');
        var ativo= false;
        var cpf = false;
        var cnpj = false;
       
        if(doc.length > 11){
            cnpj = true;
        }else{
            cpf = true;
            ativo = true;
        }

        await connection('usuarios').insert({
            id,
            name,
            doc,
            cpf,
            cnpj,
            cep,
            rua,
            bairro,
            cidade,
            estado,
            numero,
            complemento,
            nascimento,
            telefone,
            ativo,
            type,
            email,
            senha
        });

        return response.json({ id, name });
    },

    async getUsuariosComVacinas(request, response){
        console.log(request.userId);
        const usuariosComVacinas = await connection('usuarios').select('*');
        return response.json(usuariosComVacinas);
       
    }
}