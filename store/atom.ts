import { atom } from 'recoil'

import type { Mate, TrackMapValue, Position } from '../types'


//Make a new atom for each track  and make sure not to duplcate keys

export const smallDeviceState = atom({
    key: 'smallDeviceState',
    default: false,
})

export const scaleState = atom({
    key: 'scaleState',
    default: {
        className: 'scene-scale-100',
        value: 1,
    },
})

export const onlineState = atom({
    key: 'onlineState',
    default: false,
})

export const mutedState = atom({
    key: 'mutedState',
    default: true,
})

export const locationState = atom({
    key: 'locationState',
    default: {
        country: '',
        region: '',
    },
})

export const meState = atom({
    key: 'meState',
    default: {
        name: '',
        image: '',
    },
})

export const mateMapState = atom({
    key: 'mateMapState',
    default: new Map<string, Mate>(),
})

export const trackMapState = atom({
    key: 'trackMapState',
    default: new Map<string, TrackMapValue>(),
})

export const mePositionState = atom({
    key: 'mePositionState',
    default: {
        x: 0,
        y: 0,
    },
})

export const matePositionMapState = atom({
    key: 'matePositionMapState',
    default: new Map<string, Position>(),
})

export const iframePageState = atom({
    key: 'iframePageState',
    default: {
        isOpen: false,
        iframeSrc: '',
        
    },
})
