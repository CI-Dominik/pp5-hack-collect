import React from 'react'
import styles from '../styles/Avatar.module.css'

const Avatar = ({ src, height = 45, text }) => {
    return (
        <div className="d-flex flex-row align-items-center p-0">
            <span className="fw-bold"><img className={styles.Avatar} src={src} height={height} width={height} alt="Avatar" /> {text}</span>
        </div>
    )
}

export default Avatar
