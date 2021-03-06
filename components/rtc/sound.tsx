import { useState, useEffect, useMemo } from 'react'
import { Observable, Subscriber } from 'rxjs'
import { auditTime } from 'rxjs/operators'

import { useRecoilValue } from 'recoil'
import { mutedState, mePositionState, matePositionMapState } from '../../store/atom'

import { calcDistance } from '../../libs/helper'

import type { IRemoteAudioTrack } from 'agora-rtc-sdk-ng'
import type { Position } from '../../types'

import styles from './sound.module.css'

interface PositionSub {
    mePosition: Position
    matePosition: Position
}

const Sound = ({ id, audioTrack }: { id: string; audioTrack: IRemoteAudioTrack | null }) => {
    const [volume, setVolume] = useState(100)
    const muted = useRecoilValue(mutedState)

    const [subscriber, setSubscriber] = useState<Subscriber<PositionSub> | null>(null)
    const mePosition = useRecoilValue(mePositionState)
    const matePositionMap = useRecoilValue(matePositionMapState)
    const matePosition = matePositionMap.get(id) || { x: 0, y: 0 }

    useEffect(() => {
        const observer: Observable<PositionSub> = new Observable(subscriber => {
            setSubscriber(subscriber)
        })

        const subscription = observer
            .pipe(auditTime(500))
            .subscribe(({ mePosition, matePosition }) => {
                const distance = calcDistance(
                    mePosition.x,
                    mePosition.y,
                    matePosition.x,
                    matePosition.y
                )

                // The initial volume is 500, the distance over 50px starts to decay, and stops decaying when it exceeds 1000px
                const maxVolume = 500
                const minDist = 50
                const maxDist = 1000
                const k = maxVolume / (minDist - maxDist)

                let volume = maxVolume
                if (distance <= minDist) {
                    volume = maxVolume
                } else if (distance > minDist && distance < maxDist) {
                    volume = maxVolume + (distance - minDist) * k
                } else {
                    volume = 0
                }

                volume = ~~volume

                setVolume(volume)
            })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    useEffect(() => {
        if (subscriber) {
            subscriber.next({
                mePosition,
                matePosition,
            })
        }
    }, [mePosition, matePosition, subscriber])

    useEffect(() => {
        if (audioTrack) {
            audioTrack.setVolume(volume)
        }
    }, [audioTrack, volume])

    useEffect(() => {
        if (audioTrack) {
            if (muted) {
                audioTrack.stop()
            } else {
                audioTrack.play()
            }
        }
    }, [audioTrack, muted])

    return useMemo(
        () => (
            <div className='w-32 py-3 rounded-lg shadow-lg bg-white bg-opacity-80 sm:hidden'>
                <div className={`${styles.soundBox} ${muted ? '' : styles.animateSound}`}>
                    <span className={styles.line1}></span>
                    <span className={styles.line2}></span>
                    <span className={styles.line3}></span>
                    <span className={styles.line4}></span>
                    <span className={styles.line5}></span>
                </div>
                <div className='mt-2 text-sm text-center text-black font-bold'>
                    volume: {volume}%
                </div>
            </div>
        ),
        [volume, muted]
    )
}

export default Sound
