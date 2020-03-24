import React from 'react';


const ProgressBar = ({ current, goal, showText }) => {
    const progress = current > goal ? 100 : Math.round(current / goal * 100);

    return (
        <div>
            <div className="progress border bg-light mb-2">
                <div className="progress-bar bg-success progress-bar-striped-custom" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" style={{'width': progress + '%'}}>
                    {(showText) 
                        ? progress + '%' 
                        : null
                    }
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;