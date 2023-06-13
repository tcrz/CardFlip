import React from 'react'

const Stats = ({progressValue, completedCount, movesCount}) => {
  return (
    <div className="menu">
        <div className="pairs-matched">
            <div className="progress-div">
                <div style={{width: progressValue}} className="progress" />
            </div>
            <p className="menu-label">Pairs Matched</p>
            <p>
                <span className="result">{completedCount}</span>/8
            </p>
        </div>
        <div className="total-moves">
            <p>Total moves</p>
            <p className="result">{movesCount}</p>
        </div>
    </div>
  )
}

export default Stats