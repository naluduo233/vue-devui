import { invokeCallback } from './utils'
import { TDateCell, TDatePanelDataProps, TDatePanelProps } from './types'

export const getDateKey = (date: Date): string => {
    return date.toDateString()
}

export const cellClassName = (props: TDatePanelDataProps, day: TDateCell, base = 'calendar-panel-cell'): string => {
    if(day.current !== 0) {
        return `${base} disabled`
    }
    const key = getDateKey(day.date)
    if (props.type === 'range') {
        if (props.dateStart) {
            if (getDateKey(props.dateStart) === key) {
                return `${base} selected`
            }
            if (props.dateEnd && getDateKey(props.dateEnd) === key) {
                return `${base} selected`
            }
            const innerEnd = props.dateEnd || props.dateHover
            if (innerEnd) {
                const range = innerEnd > props.dateStart ? [props.dateStart, innerEnd] : [innerEnd, props.dateStart]
                if (day.date > range[0] && day.date < range[1]) {
                    return `${base} innerday`
                }
            }
        }
        return base
    } else {
        return props.dateStart && getDateKey(props.dateStart) === key ? `${base} selected` : base
    }
}

export const trigEvent = (props: TDatePanelProps, day: TDateCell): void => {
    if(day.current !== 0) {
        return
    }
    if (props.type === 'range') {
        if (!props.dateStart) {
            invokeCallback(props.onSelectStart, day.date)
        } else if (!props.dateEnd) {
            invokeCallback(props.onSelectEnd, day.date)
            typeof props.onChange === 'function' && props.onChange(props.type, props)
        } else {
            invokeCallback(props.onReset, day.date)
        }
    } else {
        invokeCallback(props.onSelected, day.date)
        typeof props.onChange === 'function' && props.onChange(props.type, props)
    }
}

export const handleDateEnter = (props: TDatePanelProps, day: TDateCell): void => {
    if(day.current !== 0) {
        return
    }
    if (props.type === 'range') {
        const key = getDateKey(day.date)
        if (!props.dateStart || getDateKey(props.dateStart) === key || props.dateEnd) {
            return
        }
        invokeCallback(props.onSelecting, day.date)
    }
}