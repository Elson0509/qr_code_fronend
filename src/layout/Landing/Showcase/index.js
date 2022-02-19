import React from 'react';
import bgShowCase1 from '../../../Images/showcase-1.jpg'
import bgShowCase2 from '../../../Images/showcase-2.jpg'
import bgShowCase3 from '../../../Images/showcase-3.jpg'
import bgShowCase4 from '../../../Images/showcase-4.jpg'
import bgShowCase5 from '../../../Images/showcase-5.jpg'
import bgShowCase6 from '../../../Images/showcase-6.jpg'
import classes from './Showcase.module.css'

const Showcase = () => {
    return (
        <section>
            <div className='container-fluid'>
                <div className='row'>
                    <div className={`col-lg-6 order-lg-2 ${classes.ShowcaseImg}`} style={{backgroundImage: `url(${bgShowCase1})`}}/>
                    <div className={`col-lg-6 my-auto order-lg-1 ${classes.ShowcaseText}`}>
                         <h2>Title</h2>
                         <p className="lead mb-0">description</p>
                    </div>
                </div>
                <div className='row'>
                    <div className={`col-lg-6 ${classes.ShowcaseImg}`} style={{backgroundImage: `url(${bgShowCase2})`}}/>
                    <div className={`col-lg-6 my-auto ${classes.ShowcaseText}`}>
                         <h2>Title</h2>
                         <p className="lead mb-0">description</p>
                    </div>
                </div>
                <div className='row'>
                    <div className={`col-lg-6 order-lg-2 ${classes.ShowcaseImg}`} style={{backgroundImage: `url(${bgShowCase3})`}}/>
                    <div className={`col-lg-6 my-auto order-lg-1 ${classes.ShowcaseText}`}>
                         <h2>Title</h2>
                         <p className="lead mb-0">description</p>
                    </div>
                </div>
                <div className='row'>
                    <div className={`col-lg-6 ${classes.ShowcaseImg}`} style={{backgroundImage: `url(${bgShowCase4})`}}/>
                    <div className={`col-lg-6 my-auto ${classes.ShowcaseText}`}>
                         <h2>Title</h2>
                         <p className="lead mb-0">description</p>
                    </div>
                </div>
                <div className='row'>
                    <div className={`col-lg-6 order-lg-2 ${classes.ShowcaseImg}`} style={{backgroundImage: `url(${bgShowCase5})`}}/>
                    <div className={`col-lg-6 my-auto order-lg-1 ${classes.ShowcaseText}`}>
                         <h2>Title</h2>
                         <p className="lead mb-0">description</p>
                    </div>
                </div>
                <div className='row'>
                    <div className={`col-lg-6 ${classes.ShowcaseImg}`} style={{backgroundImage: `url(${bgShowCase6})`}}/>
                    <div className={`col-lg-6 my-auto ${classes.ShowcaseText}`}>
                         <h2>Title</h2>
                         <p className="lead mb-0">description</p>
                    </div>
                </div>
                
            </div>
        </section>
    );
};

export default Showcase;