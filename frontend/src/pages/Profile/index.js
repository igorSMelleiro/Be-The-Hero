import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import  { FiPower, FiTrash2 } from 'react-icons/fi';

import api from '../../services/api';

import './styles.css';

import logoImg from '../../assets/logo.svg';
import { useState } from 'react';

export default function Profile() {
    const [inscidents, setIncidents] =useState([]);

    const history = useHistory();
    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');

    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: ongId,
            }
        }).then(response => {
            setIncidents(response.data);
        })
    }, [ongId]);

    async function handleDeleteIncident(id) {
        try{
          await api.delete(`incidents/${id}`, {
              headers: {
                  Authorization: ongId,
              }
          });

          setIncidents(inscidents.filter(inscident => inscident.id !== id));
        } catch (err) {
          alert('Erro ao deletar caso, tente novamente.');
        }
    }

    function handleLogout() {
        localStorage.clear();
        
        history.push('/');
    }

    return(
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be The Hero" />
                <span>Bem vinda, {ongName} </span>

                <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
                <button onClick={handleLogout} type="button">
                    <FiPower size={18} color="#e02041" />
                </button>
            </header>

            <h1> Casos cadastrados </h1>
                <ul>
                        {inscidents.map(inscident => (
                            <li key={inscident.id}>
                                <strong>CASO: </strong>
                                <p>{inscident.title}</p>
        
                                <strong>DESCRIÇÃO: </strong>
                                <p>{inscident.description}</p>
        
                                <strong>VALOR: </strong>
                                <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(inscident.value)}</p>
        
                                <button onClick={() => handleDeleteIncident(inscident.id)} type="button">
                                    <FiTrash2 size={20} color="#a8a8b3" />
                                </button>
                            </li>
                        ))}
                </ul>
        </div>
    );
}