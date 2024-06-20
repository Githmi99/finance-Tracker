import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/globalContext'; // Corrected path
import { dollar } from '../utils/Icons'; // Corrected path
import { Pie } from 'react-chartjs-2';

const validCategories = ['Salary', 'Groceries', 'Utilities', 'Entertainment', 'Transport', 'Health', 'Others'];

function ViewTransactions() {
    const { getTransactions } = useGlobalContext();
    const [transactions, setTransactions] = useState([]);
    const [category, setCategory] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = (category = '') => {
        const query = category ? `?category=${category}` : '';
        fetch(`/api/transactions${query}`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched transactions:', data);
                setTransactions(data);
            })
            .catch(error => console.error('Error fetching transactions:', error));
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        fetchTransactions(e.target.value);
    };

    const getChartData = () => {
        const data = validCategories.map(cat => {
            return transactions
                .filter(trans => trans.category === cat)
                .reduce((total, trans) => total + trans.amount, 0);
        });

        const chartData = {
            labels: validCategories,
            datasets: [
                {
                    label: 'Transactions',
                    data: data,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#FF6384',
                    ],
                },
            ],
        };

        console.log('Chart data:', chartData);
        return chartData;
    };

    return (
        <TransactionsStyled>
            <h1>View Transactions</h1>
            <div className="filter-container">
                <label htmlFor="category">Filter by Category: </label>
                <select id="category" value={category} onChange={handleCategoryChange}>
                    <option value="">All</option>
                    {validCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div className="stats-con">
                <div className="chart-con">
                    <Pie data={getChartData()} />
                </div>
                <div className="history-con">
                    <h2>Summary</h2>
                    <ul>
                        {transactions.map(trans => (
                            <li key={trans._id} className={trans.amount > 0 ? 'income' : 'expense'}>
                                <p>{trans.category}</p>
                                <p>{new Date(trans.date).toLocaleDateString()}</p>
                                <p>{trans.amount > 0 ? `+${dollar}${trans.amount}` : `-${dollar}${Math.abs(trans.amount)}`}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </TransactionsStyled>
    )
}

const TransactionsStyled = styled.div`
    padding: 2rem;
    h1 {
        text-align: center;
        margin-bottom: 2rem;
        color: #333;
    }
    .filter-container {
        display: flex;
        justify-content: center;
        margin-bottom: 2rem;
        label {
            margin-right: 0.5rem;
        }
        select {
            padding: 0.5rem;
            border-radius: 5px;
            border: 1px solid #ccc;
        }
    }
    .stats-con {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 2rem;

        .chart-con {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .history-con {
            h2 {
                margin: 1rem 0;
                text-align: center;
                color: #333;
            }
            ul {
                list-style: none;
                padding: 0;
                .income {
                    color: green;
                }
                .expense {
                    color: red;
                }
                li {
                    display: flex;
                    justify-content: space-between;
                    background: #FCF6F9;
                    border: 2px solid #FFFFFF;
                    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                    padding: 1rem;
                    border-radius: 20px;
                    margin-bottom: 1rem;
                    p {
                        margin: 0;
                    }
                }
            }
        }
    }
`;

export default ViewTransactions;
