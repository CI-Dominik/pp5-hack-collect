import React from 'react'
import { Image } from 'react-bootstrap';
import heroImage from '../assets/hero.jpg'

const HeroArea = () => {
    return (
        <Image className="p-0" src={heroImage} fluid />
    );
}

export default HeroArea
