const Pagination = (props) => {
    const pageNumbers = []

    const delta = 2;
    const left = props.page - delta
    const right = props.page + delta + 1
    const range = []
    let l
    
    for(let i=1; i<= props.lastPage; i++){
        if(i === 1 || i === props.lastPage || (i >=left && i < right))
            range.push(i)
    } 

    range.forEach(el => {
        if(l){
            if(el - l > 1)
                pageNumbers.push('...')
        }
        pageNumbers.push(el)
        l=el
    })

    let countDelta = 1

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
                {props.page!==1 && <li className="page-item"><button className="page-link" onClick={() => props.change(props.page-1)}>Anterior</button></li>}
                {pageNumbers.map( num => {
                    return num === '...' ?
                        <li className="page-item disabled" key={`delta${countDelta++}`}>
                            <button className="page-link">
                                ...
                            </button>
                        </li>
                        :
                        <li className={`page-item ${props.page==num? 'active' : ''}`} key={`page${num}`}>
                            <button className="page-link" onClick={() => props.change(num)}>
                                {num}
                                {props.page==num && <span className="sr-only">(current)</span>}
                            </button>
                        </li>
                })}
                {props.page!=props.lastPage && <li className="page-item"><button className="page-link" onClick={() => props.change(props.page+1)}>Próximo</button></li>}
            </ul>
        </nav>
    );
};

export default Pagination;