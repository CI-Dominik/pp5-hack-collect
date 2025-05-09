import React from 'react'
import styles from '../styles/Avatar.module.css'

// Avatar component displaying picture, setting the height and adding a text

const Avatar = ({ src, height = 45, text }) => {
    return (
            <span className={`fw-bold ${styles.AvatarHover}`}><img className={styles.Avatar} src={src} height={height} width={height} alt="Avatar" /> {text}</span>
    )
}

export default Avatar
