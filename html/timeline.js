class Marker {
    constructor(text, date, angle) {
        this.text = text
        this.date = date
        this.angle = angle
    }
}

class Markers {
    constructor(height=100) {
        this.markers = []
        this.height = height
    }

    addMarker(marker) {
        this.markers.push(marker)
    }
}

class YearLabel {
    constructor() {
        this.height = 40
    }
}

class MonthLabel {
    constructor() {
        this.height = 40
    }
}

class Milestone {

    beginIndicator = false
    endIndicator = false

    constructor(description, beginDate, endDate) {
        this.description = description
        this.beginDates = []
        this.endDates = []
        this.addDateRange(beginDate, endDate)
    }

    addDateRange(beginDate, endDate) {
        this.beginDates.push(beginDate)
        this.endDates.push(endDate)
    }

    getCombinedDateRange() {
        return {
            beginDate: this.beginDates[0],
            endDate: this.endDates[this.endDates.length-1]
        }
    }

    setBeginIndicator(beginIndicator) {
        this.beginIndicator = beginIndicator
    }

    setEndIndicator(endIndicator) {
        this.endIndicator = endIndicator
    }
}

class Phase {
    milestones = []

    constructor(phaseName, visualPattern, milestonHeight = 25) {
        this.phaseName = phaseName
        this.visualPattern = visualPattern
        this.milestonHeight = milestonHeight
    }

    getHeight() {
        return this.milestones.length * this.milestonHeight
    }

    addMilestone(milestone) {
        this.milestones.push(milestone)
    }
}


class Timeline {

    phases = []
    opaqueMasks = []

    setTopMarkers(markers) {
        this.topMarkers = markers
    }

    setYearLabel(yearLabel) {
        this.yearLabel = yearLabel
    }

    setMonthLabel(monthLabel) {
        this.monthLabel = monthLabel
    }

    addPhase(phase) {
        this.phases.push(phase)
    }

    setBottomMarkers(markers) {
        this.bottomMarkers = markers
    }

    setOpaqueMask(dateRanges) {
        this.opaqueMasks = dateRanges
    }

    getHeight() {
        var height = 0
        for(var i=0; i<this.phases.length; i++) {
            height = this.phases[i].getHeight()
        }
        return height
    }
}

