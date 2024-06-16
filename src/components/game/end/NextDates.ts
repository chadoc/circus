import Source from '../../../assets/gimmick/nextdates.txt?raw'


const nextDates = (Source as string).split('\n').filter(s => s.length > 0)


export function getNextDates(): string[] {
    return nextDates
}
