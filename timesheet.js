class Timesheet {
    constructor(startDate, endDate, labels, projects, holidays) {
        this.dateRange = new DateRange(new Date(startDate), new Date(endDate));
        this.labels = labels
        this.projects = projects
        this.holidays = holidays
        this.canvas = new fabric.Canvas('main');
        this.init()
    }

    init() {
        var height = 0
        for (let i = 0; i < this.labels.labels.length; i++) {
            height = height + this.labels.labels[i].height
        }
        this.labelHeight = height
        this.labelWidth = this.labels.width
        this.projectWidth = this.projects.width
        height = 0
        for (let i = 0; i < this.projects.projects.length; i++) {
            var project = this.projects.projects[i]
            height = height + project.height * project.milestones.length
        }
        this.projectHeight = height
    }

    draw() {
        this.drawLabel(this.projectWidth)
        this.drawProjects(0, this.labelHeight)
        if (this.labels.showTimeline) {
            this.drawDayline(new Date(), "yellow", 2, [5, 5], "Today", new Font())
        }
        this.drawHolidays()
    }

    drawHolidays() {
        for (let i = 0; i < this.holidays.length; i++) {
            const holiday = this.holidays[i]
            this.drawDayline(new Date(holiday.begin), holiday.fill, 2, [1, 1], holiday.desc, new Font())
            this.drawDayline(new Date(holiday.end), holiday.fill, 2, [1, 1], "", new Font())
        }
    }

    drawDayline(drawDate, color, width, dashArray, text, font) {
        const posPercentage = this.dateRange.getPositionPercentage(drawDate)
        const relativePos = this.labelWidth * posPercentage
        const top = this.labelHeight
        const left = this.projectWidth + relativePos
        var timeline = new fabric.Line([left, top, left, top + this.projectHeight], {
            left: left,
            top: top,
            stroke: color,
            strokeWidth: width,
            strokeDashArray: dashArray
        });
        this.canvas.add(timeline)

        if (text !== "undefined") {
            var text = new fabric.Textbox(text, {
                left: left,
                top: top + this.projectHeight,
                fontSize: font.size,
                fontFamily: font.family,
                textAlign: font.align,
                fill: font.color,
                width: 200,
                textAlign: 'left',
                centeredRotation: false,
                angle: 45
            });
            this.canvas.add(text)
        }

    }

    drawLabel(left) {
        var top = 0
        for (let i = 0; i < this.labels.labels.length; i++) {
            var label = this.labels.labels[i]
            if (label.mode.toLowerCase() === 'year') {
                this.drawYearLabel(left, top, label, this.labelWidth, this.labels.visualLabelPattern)
            }
            if (label.mode.toLowerCase() === 'month') {
                this.drawMonthLabel(left, top, label, this.labelWidth, this.labels.visualLabelPattern)
            }
            if (label.mode.toLowerCase() === 'text') {
                this.drawTextLabel(left, top, label, this.labelWidth, this.labels.visualLabelPattern)
            }
            top = top + label.height
        }
    }

    drawYearLabel(left, top, label, width, visualLabelPattern) {
        var months = this.dateRange.getMonths()
        const yearMap = new Map()
        for (let i = 0; i < months.length; i++) {
            var year = months[i].year
            if (yearMap.has(year)) {
                yearMap.set(year, yearMap.get(year) + 1)
            } else {
                yearMap.set(year, 1)
            }
        }
        var startYear = months[0].year
        var adjustLeft = left
        for (let i = 0; i < yearMap.size; i++) {
            var adjustWidth = width / months.length * yearMap.get(startYear)
            var rect = this.drawRect(adjustLeft, top, adjustWidth, label.height, visualLabelPattern.labelBackgroud, visualLabelPattern.labelRectStyle)
            var text = this.drawText(startYear, adjustLeft, top, adjustWidth, label.height, visualLabelPattern.yearLabelFont)
            this.canvas.add(rect)
            this.canvas.add(text)
            startYear = startYear + 1
            adjustLeft = adjustLeft + adjustWidth
        }
    }

    drawMonthLabel(left, top, label, width, visualLabelPattern) {
        var months = this.dateRange.getMonths()
        for (let i = 0; i < months.length; i++) {
            var adjustLeft = left + width * i / months.length
            var adjustWidth = width / months.length
            var rect = this.drawRect(adjustLeft, top, adjustWidth, label.height, visualLabelPattern.labelBackgroud, visualLabelPattern.labelRectStyle)
            var text = this.drawText(months[i].monthDesc, adjustLeft, top, adjustWidth, label.height, visualLabelPattern.monthLabelFont)
            this.canvas.add(rect)
            this.canvas.add(text)
        }
    }

    drawTextLabel(left, top, labels, width, visualLabelPattern) {
        for (let i = 0; i < labels.labels.length; i++) {
            var label = labels.labels[i]
            var positionPercentage = this.dateRange.getPositionPercentage(new Date(label.date))

            const triangle = new fabric.Triangle({
                // Define triangle properties
                width: 10,
                height: 10,
                fill: visualLabelPattern.labelBackgroud,
                stroke: 'black',
                strokeWidth: 1,
                left: left + width * positionPercentage + 10,
                top: top + labels.height,
                angle: 180
            });
            this.canvas.add(triangle)

            var text = new fabric.Textbox(label.text, {
                left: left + width * positionPercentage + 5,
                top: top + labels.height - 25,
                fontSize: label.font.size,
                fontFamily: label.font.family,
                textAlign: label.font.align,
                fill: label.font.color,
                width: 200,
                textAlign: 'left',
                centeredRotation: false,
                angle: label.angle
            });
            this.canvas.add(text)
        }
    }

    drawProjects(left, top) {
        var start = top
        for (let i = 0; i < this.projects.projects.length; i++) {
            var project = this.projects.projects[i]
            var rect = this.drawRect(left, start, this.projectWidth,
                project.height * project.milestones.length, project.visualPattern.projectBackground, project.visualPattern.projectRectStyle)
            var text = this.drawText(project.phase, left, start, this.projectWidth,
                project.height * project.milestones.length, project.visualPattern.projectFont)
            this.canvas.add(rect)
            this.canvas.add(text)

            var milestonRect = this.drawRect(left + this.projectWidth, start, this.labelWidth,
                project.height * project.milestones.length, project.visualPattern.milestoneBackground, project.visualPattern.projectRectStyle)
            this.canvas.add(milestonRect)

            var milestones = project.milestones
            var milestoneHeight = project.height
            var milestoneLeft = left + this.projectWidth
            for (let j = 0; j < milestones.length; j++) {
                this.drawMilestone(milestones[j], milestoneLeft, start + j * milestoneHeight, milestoneHeight, project)
            }
            start = start + project.height * project.milestones.length
        }
    }

    drawMilestone(milestone, milestoneLeft, milestoneStart, milestoneHeight, project) {
        const font = project.visualPattern.milestoneFont
        const ctx = this.canvas.getContext('2d');
        const measure = ctx.measureText(milestone.desc, font.size + 'px ' + font.family)
        const textWidth = measure.width;
        const textHeight = measure.fontBoundingBoxAscent

        var timeDesc = milestone.begin.substring(0, 5) + " - " + milestone.end.substring(0, 5)
        if ( new Date(milestone.end) > this.dateRange.endDate ) {
        	timeDesc = milestone.begin.substring(0, 5) + " - " + milestone.end
        } 

        var test = document.getElementById("Test");
        test.style.fontSize = font.size;
        test.style.fontFamily = font.family
        test.innerText = timeDesc
        const timeTextWidth = test.clientWidth;

        var beginPos = this.getPostion(milestone.begin, this.dateRange, this.labelWidth)
        var milestoneWidth = this.getPostion(milestone.end, this.dateRange, this.labelWidth) - beginPos
        var rect = this.drawRect(milestoneLeft + beginPos, milestoneStart + (milestoneHeight - textHeight - 10) / 2, milestoneWidth, textHeight + 10,
            project.visualPattern.milestoneBlockBackground, project.visualPattern.milestoneBlockRectStyle)

        this.canvas.add(rect)

        var text = this.drawText(milestone.desc, milestoneLeft + beginPos + milestoneWidth, milestoneStart, 2 * textWidth, milestoneHeight, font, 'left')
        this.canvas.add(text)

        if (timeTextWidth < milestoneWidth) {
            var f = new Font(milestone.font)
            f.color = "white"
            var timeText = this.drawText(timeDesc, milestoneLeft + beginPos, milestoneStart, milestoneWidth, milestoneHeight, f)
            this.canvas.add(timeText)
        } else {
            var timeText = this.drawText(timeDesc, milestoneLeft + beginPos - timeTextWidth, milestoneStart, timeTextWidth, milestoneHeight, font)
            this.canvas.add(timeText)
        }
    }

    getPostion(date, dateRange, width) {
    	var dt = new Date(date)
    	if ( dt > dateRange.endDate) {
    		dt = dateRange.endDate
    	}
        return width * dateRange.getPositionPercentage(dt)
    }

    drawRect(left, top, width, height, background, rectStyle) {
        var rect = new fabric.Rect({
            left: left,
            top: top,
            width: width,
            height: height,
            fill: background,
            strokeWidth: rectStyle.strokeWidth,
            stroke: rectStyle.stroke,
            rx: rectStyle.rx === undefined ? 0 : rectStyle.rx,
            rx: rectStyle.ry === undefined ? 0 : rectStyle.ry,
            opacity: rectStyle.opacity
        });
        return rect
    }

    drawText(text, left, top, width, height, font, textAlign = "center") {
        var virtualText = new fabric.Textbox(text + "", {
            left: left,
            top: top,
            fontSize: font.size,
            fontFamily: font.family,
            textAlign: font.align,
            fill: font.color,
            width: width,
            height: height
        });

        var finalText = new fabric.Textbox(text + "", {
            left: left,
            top: top + (height - virtualText.getScaledHeight()) / 2,
            fontSize: font.size,
            fontFamily: font.family,
            textAlign: font.align,
            fill: font.color,
            width: width,
            textAlign: textAlign
        });
        return finalText
    }
}

class VisualLabelPattern {
    constructor() {
        this.labelBackgroud = "#1f3863"
        this.yearLabelFont = new Font().withColor("white").withSize(18)
        this.monthLabelFont = new Font().withColor("white").withSize(16)
        this.labelRectStyle = new RectStyle().withStrokeWidth(1).withStroke("white")
    }

    withLabelBackground(labelBackgroud) {
        this.labelBackgroud = labelBackgroud
        return this
    }

    withYearLabelFont(yearLabelFont) {
        this.yearLabelFont = yearLabelFont
        return this
    }

    withMonthLabelFont(monthLabelFont) {
        this.monthLabelFont = monthLabelFont
        return this
    }

    withLabelRectStyle(labelRectStyle) {
        this.labelRectStyle = labelRectStyle
        return this
    }
}
class VisualProjectPattern {

    constructor() {
        this.projectFont = new Font()
        this.milestoneFont = new Font()
        this.milestoneBlockRectStyle = new RectStyle().withRx(3).withRy(3)
        this.projectRectStyle = new RectStyle().withStrokeWidth(3).withStroke("white")
    }
    withProjectBackground(projectBackground) {
        this.projectBackground = projectBackground
        return this
    }

    withMilestoneBackgroud(milestoneBackground) {
        this.milestoneBackground = milestoneBackground
        return this
    }

    withMilestoneBlockBackgroud(milestoneBlockBackground) {
        this.milestoneBlockBackground = milestoneBlockBackground
        return this
    }
    withProjectFont(font) {
        this.projectFont = font
        return this
    }

    withMilestoneFont(font) {
        this.milestoneFont = font
        return this
    }

    withmilestoneBlockRectStyle(milestoneBlockRectStyle) {
        this.milestoneBlockRectStyle = milestoneBlockRectStyle
        return this
    }

    withProjectRectStyle(projectRectStyle) {
        this.projectRectStyle = projectRectStyle
        return this
    }
}

class Font {
    constructor() {
        this.size = 14;
        this.color = "black";
        this.family = "Arial"
        this.fontWeight = "normal"
        this.fontStyle = "normal"
        this.align = "center"
    }

    withSize(size) {
        this.size = size
        return this
    }

    withColor(color) {
        this.color = color
        return this
    }

    withFontWeight(fontWeight) {
        this.fontWeight = fontWeight
        return this
    }

    withFontStyle(fontStyle) {
        this.fontStyle = fontStyle
        return this
    }

    withAlign(align) {
        this.align = align
        return this
    }
}

class RectStyle {
    constructor() {
        this.stroke = "white"
        this.strokeWidth = 0
        this.rx = 0
        this.ry = 0
        this.opacity = 1
    }

    withStroke(stroke) {
        this.stroke = stroke
        return this
    }

    withStrokeWidth(strokeWidth) {
        this.strokeWidth = strokeWidth
        return this
    }

    withRx(rx) {
        this.rx = rx
        return this
    }

    withRy(ry) {
        this.ry = ry
        return this
    }

    withOpacity(opacity) {
        this.opacity = opacity
        return this
    }
}

class DateRange {
    constructor(startDate, endDate) {
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
    }

    getMonths() {
        const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var months = []
        var date = new Date(this.startDate)
        date.setDate(1)
        while (date <= this.endDate) {
            months.push({
                year: date.getFullYear(),
                month: date.getMonth(),
                monthDesc: monthShortNames[date.getMonth()]
            })
            if (date.getMonth() != 11) {
                date.setMonth(date.getMonth() + 1)
            } else {
                date.setFullYear(date.getFullYear() + 1)
                date.setMonth(0)
            }
        }
        return months
    }

    getPositionPercentage(date) {
        var months = this.getMonths()
        var index = 0;
        for (; index < months.length; index++) {
            var month = months[index]
            if (month.year === date.getFullYear() && month.month === date.getMonth()) {
                break;
            }
        }
        return index / months.length + date.getDate() / this.daysInMonth(date.getFullYear(), date.getMonth()) / months.length
    }

    daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }
}

