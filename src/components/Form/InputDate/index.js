import React from 'react';

const InputDate = (props) => {
    const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro']

    const dayChangeHandler = ev => {
        if((ev.target.value > 31 || ev.target.value < 1) && ev.target.value!=='')
            return
        props.setDate({...props.date, day:ev.target.value})
    }

    const yearChangeHandler = ev => {
        if(ev.target.value > new Date().getFullYear()+3 && ev.target.value!=='')
            return
        props.setDate({...props.date, year:ev.target.value})
    }

    return (
        <div className="row my-2">
            {!!props.title && <label>{props.title}</label>}
            <div className="col">
                <input 
                    type="number" 
                    min='1' 
                    max='31' 
                    className="form-control" 
                    placeholder='Dia' 
                    value={props.date.day}
                    onChange={dayChangeHandler}
                />
            </div>
            <div className="col">
                <select 
                    className="form-control" 
                    placeholder='Mês' 
                    value={props.date.month} 
                    onChange={ev=> props.setDate({...props.date, month:ev.target.value})}
                >
                    {
                        months.map((el, ind)=>{
                            return <option value={ind+1} key={el}>{el}</option>
                        })
                    }
                </select>
            </div>
            <div className="col">
                <input 
                    type="number" 
                    className="form-control" 
                    max={props.maxYear || new Date().getFullYear()+3} 
                    min={props.minYear || new Date().getFullYear()} 
                    placeholder='Ano'
                    value={props.date.year}
                    onChange={yearChangeHandler}
                />
            </div>
        </div>
    );
};

export default InputDate;