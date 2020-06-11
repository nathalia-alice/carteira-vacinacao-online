import React, {useEffect, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiUserCheck, FiAlertTriangle } from 'react-icons/fi';
import api from '../../services/api';
import './styles.css'
import logoImg from  '../../assets/saúde.png';

export default function Home(){
    const [users, setUsers] = useState([]);
    const [profile, setProfile] = useState([]);
    const history = useHistory();
    const token = localStorage.getItem('token');
   
    let button;
    let listVaccine;

    useEffect(()=>{
        getVacinasPorUsuario();
        getProfile();
    })

    function handleLogout(){
        localStorage.removeItem('token');
        history.push('/')
    }

    function getProfile(){
        if(profile.length === 0){
            api.get('profile', {
                headers: { 
                    'x-access-token': token
                }  
            })
            .then(response => {
                setProfile(response.data);
            })
            .catch(error => {
                console.error(error.response.data.message);
                handleLogout();
            })
        }
    }

    function getVacinasPorUsuario(){
        if(users.length === 0){
            api.get('users/disabled', {
                headers: { 
                    'x-access-token': token
                }  
            })
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error(error.response.data.message);
                handleLogout();
            })
        }
    }

    function enableUsers(event){

        try{
            api.put(`usersdisabled/${profile.id}`, {
                 headers: {'x-access-token': token }
            });

            getVacinasPorUsuario();
        }catch(err){
            console.error("Erro:", err);
            handleLogout();
        }
    }

    if(profile.type === "posto-saude") {
        button =  <Link className="button" to="/vaccinesxuser/new">Cadastrar nova vacina</Link>;
    }else if(profile.type === 'administrador'){
        button =  <Link className="button" to="/vaccines/new">Cadastrar nova vacina</Link>;
        listVaccine = <Link className="button" to="/listvaccine">Visualizar vacinas</Link>;
    }
    
    return (
        <div className="profile-container">
            <header>
                <a className="logo" href="/">
                    <img src={logoImg} alt="Carteira de Vacinação Online"></img>
                </a>
                
                <Link className="button" to={{
                    pathname: "/edit",
                    state: profile
                }}>Editar Perfil</Link>
                { button }
                { listVaccine }
                <button type="button" onClick={handleLogout}>
                    <FiPower size={18} color="#E02041"></FiPower>
                </button>
            </header>
            <span>Bem vindo(a), {profile.name}</span>
            <h1>Aprovação Posto de Saúde</h1>
            <ul>
                {users.map((user) => (
                <li key={user.id_user + user.id_vaccine}>
                    <strong>NOME DO CIDADÃO:</strong>
                    <p>{user.name}</p>
                    <strong>DOCUMENTO:</strong>
                    <p>{user.doc}</p>
                    <strong>E-MAIL:</strong>
                    <p>{user.email}</p>
                    <strong>TELEFONE:</strong>
                    <p>{user.telephone}</p>
                    <button type="button" onClick={enableUsers}>
                       <FiUserCheck size={20} color="green"></FiUserCheck>
                   </button>
                   <div className="alert-warning">Pendente de aprovação </div>
                   <span className="alert-icon">
                        <FiAlertTriangle size={20} color="orange"></FiAlertTriangle>
                   </span>
                </li>
                ))}
            </ul>
        </div>
    );
}