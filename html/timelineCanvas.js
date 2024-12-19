class TimelineCanvas {
    constructor(width, projectWidth, startDate, endDate, timeline) {
        this.width = width
        this.projectWidth = projectWidth
        this.timelineWidth = this.width - this.projectWidth
        this.dateRange = new DateRange(new Date(startDate), new Date(endDate));
        this.timeline = timeline

        this.drawing = new DrawingUtl()
        this.canvas = new fabric.Canvas('main');
    }

    draw() {
        var top = 0
        top = top + this.drawTopMarker(top)
        top = top + this.drawYearLabel(top)
        top = top + this.drawMonthLabel(top)
        this.phaseTop = top
        for (var i=0; i<this.timeline.phases.length; i++) {
            top = top + this.drawPhase(this.timeline.phases[i], top)
        }
        top = top + this.drawBottomMarker(top)
        this.drawOpaqueMask(top)
    }

    drawPhase(phase, top) {
        this.canvas.add(this.drawing.drawRect(0, top, this.projectWidth, phase.getHeight(), phase.visualPattern.projectBackground
            , phase.visualPattern.projectRectStyle))
        this.canvas.add(this.drawing.drawText(phase.phaseName, top, 0, this.projectWidth, phase.getHeight(), phase.visualPattern.projectFont))

        this.canvas.add(this.drawing.drawRect(this.projectWidth, top, this.timelineWidth, phase.getHeight(), phase.visualPattern.milestoneBackground
            , phase.visualPattern.projectRectStyle))

        for (var i=0; i<phase.milestones.length; i++) {
            this.drawMilestone(phase, phase.milestones[i], top+i*phase.milestonHeight)
        }
        return phase.getHeight()
    }

    drawMilestone(phase, milestone, top) {
        const sameDayWidth = 3
        const descriptionHeight = this.drawing.measureHeight(milestone.description, phase.visualPattern.milestoneFont, this.canvas)
        const descriptionWidth = this.drawing.measureWidth(milestone.description, phase.visualPattern.milestoneFont)

        for (var i=0; i<milestone.beginDates.length; i++) {
            var left = this.calculateXByDate(milestone.beginDates[i])
            var right = this.calculateXByDate(milestone.endDates[i])
            if ( left === right ) {
                right = right + sameDayWidth
            }

            this.canvas.add(this.drawing.drawRect(left, top + (phase.milestonHeight - descriptionHeight - 10) / 2, (right-left),
                descriptionHeight + 10, phase.visualPattern.milestoneBlockBackground, phase.visualPattern.milestoneBlockRectStyle))
        }

        const combinedDateRange = milestone.getCombinedDateRange()
        var timeDesc = combinedDateRange.beginDate.substring(0, 5) + " - " + combinedDateRange.endDate.substring(0, 5)
        if ( combinedDateRange.beginDate === combinedDateRange.endDate ) {
            timeDesc = combinedDateRange.beginDate.substring(0, 5)
        }
        if ( new Date(combinedDateRange.endDate) > this.dateRange.endDate ) {
            timeDesc = combinedDateRange.beginDate.substring(0, 5) + " - " + combinedDateRange.endDate
        }

        var farRight = this.calculateXByDate(combinedDateRange.endDate)
        if ( combinedDateRange.beginDate === combinedDateRange.endDate ) {
            farRight = farRight + sameDayWidth
        }
        this.canvas.add(this.drawing.drawText(milestone.description, top, farRight, 2 * descriptionWidth, phase.milestonHeight,
            phase.visualPattern.milestoneFont, 'left'))

        const timeTextWidth = this.drawing.measureWidth(timeDesc, phase.visualPattern.milestoneFont, this.canvas)
        var left = this.calculateXByDate(milestone.beginDates[0])
        if (timeTextWidth < (farRight-left)) {
            var f = new Font(phase.visualPattern.milestoneFont).withColor('white')
            this.canvas.add(this.drawing.drawText(timeDesc, top, left, farRight-left, phase.milestonHeight, f))
        } else {
            this.canvas.add(this.drawing.drawText(timeDesc, top, left - timeTextWidth, timeTextWidth,
                phase.milestonHeight, phase.visualPattern.milestoneFont))
        }

        // draw indicator
        if (milestone.beginIndicator) {
            this.canvas.add(this.drawing.drawline(this.timeline.topMarkers.height, left, top-this.timeline.topMarkers.height, IndicatorColor, 2, [1, 1]))
        }
        if (milestone.endIndicator) {
            this.canvas.add(this.drawing.drawline(this.timeline.topMarkers.height, farRight, top-this.timeline.topMarkers.height, IndicatorColor, 2, [1, 1]))
        }

    }

    drawTopMarker(top) {
        if (typeof this.timeline.topMarkers === 'undefined') {
            return 0
        }
        var topMarkers = this.timeline.topMarkers
        if ( topMarkers.markers.length === 0 ) {
            return 0
        }

        for (var i=0; i<topMarkers.markers.length; i++) {
            var marker = topMarkers.markers[i]
            var left = this.calculateXByDate(marker.date)
            this.canvas.add(this.drawing.drawTriangle(left+5, top + topMarkers.height))
            this.canvas.add(this.drawing.drawMarker(marker.text, top + topMarkers.height - 25, left, new Font().withAngle(marker.angle)))
        }
        return topMarkers.height
    }

    drawBottomMarker(top) {
        if (typeof this.timeline.bottomMarkers === 'undefined') {
            return 0
        }
        var bottomMarkers = this.timeline.bottomMarkers
        if ( bottomMarkers.markers.length === 0 ) {
            return 0
        }
        for (var i=0; i<bottomMarkers.markers.length; i++) {
            var marker = bottomMarkers.markers[i]
            var left = this.calculateXByDate(marker.date)
            this.canvas.add(this.drawing.drawTriangle(left-5, top, 0))
            this.canvas.add(this.drawing.drawMarker(marker.text, top+10, left, new Font().withAngle(marker.angle)))
        }
        return bottomMarkers.height
    }

    drawOpaqueMask(top) {
        if (typeof this.timeline.opaqueMasks === 'undefined') {
            return
        }
        if ( this.timeline.opaqueMasks.length === 0 ) {
            return
        }
        for (var i=0; i<this.timeline.opaqueMasks.length; i++) {
            var mask = this.timeline.opaqueMasks[i]
            var left = this.calculateXByDate(mask.startDate)
            var right = this.calculateXByDate(mask.endDate)
            this.canvas.add(this.drawing.drawRect(left, this.phaseTop, right-left, this.timeline.getHeight(), 'black', ProjectDisplayPattern.purple.milestoneBlockRectStyle.withOpacity(0.1)))
        }
    }

    drawYearLabel(top) {
        if (typeof this.timeline.yearLabel === 'undefined') {
            return 0
        }
        var months = this.dateRange.getMonths()
        var yearMap = this.dateRange.getYearMap()
        var startYear = months[0].year
        var adjustLeft = this.projectWidth
        for (let i = 0; i < yearMap.size; i++) {
            var adjustWidth = this.timelineWidth / months.length * yearMap.get(startYear)
            var rect = this.drawing.drawRect(adjustLeft, top, adjustWidth, this.timeline.yearLabel.height, LabelBackgroud, LabelRectStyle)
            var text = this.drawing.drawText(startYear, top, adjustLeft, adjustWidth, this.timeline.yearLabel.height, YearLabelFont)
            this.canvas.add(rect)
            this.canvas.add(text)
            startYear = startYear + 1
            adjustLeft = adjustLeft + adjustWidth
        }
        return this.timeline.yearLabel.height
    }

    drawMonthLabel(top) {
        if (typeof this.timeline.monthLabel === 'undefined') {
            return 0
        }
        var months = this.dateRange.getMonths()
        for (let i = 0; i < months.length; i++) {
            var adjustLeft = this.projectWidth + this.timelineWidth * i / months.length
            var adjustWidth = this.timelineWidth / months.length
            var rect = this.drawing.drawRect(adjustLeft, top, adjustWidth, this.timeline.monthLabel.height, LabelBackgroud, LabelRectStyle)
            var text = this.drawing.drawText(months[i].monthDesc, top, adjustLeft, adjustWidth, this.timeline.monthLabel.height, MonthLabelFont)
            this.canvas.add(rect)
            this.canvas.add(text)
        }
        return this.timeline.monthLabel.height
    }

    calculateXByDate(date) {
        var dt = date
        if ( isString(date) ) {
            dt = new Date(date)
        }
        if ( dt > this.dateRange.endDate) {
            dt = this.dateRange.endDate
        }
       return this.projectWidth + this.timelineWidth * this.dateRange.getPositionPercentage(dt)
    }
}