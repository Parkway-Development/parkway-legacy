// dtos.js

class Address {
    constructor({
        country,
        subdivision,
        city,
        postalCode,
        streetAddress,
        formattedAddress,
        geocode
    }) {
        this.country = country;
        this.subdivision = subdivision;
        this.city = city;
        this.postalCode = postalCode;
        this.streetAddress = streetAddress;
        this.formattedAddress = formattedAddress;
        this.geocode = geocode;
    }
}

class Location {
    constructor({ name, type, address, locationTbd }) {
        this.name = name;
        this.type = type;
        this.address = new Address(address);
        this.locationTbd = locationTbd;
    }
}

class DateAndTimeSettings {
    constructor({
        startDate,
        endDate,
        timeZoneId,
        hideEndDate,
        showTimeZone,
        recurrenceStatus,
        formatted
    }) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.timeZoneId = timeZoneId;
        this.hideEndDate = hideEndDate;
        this.showTimeZone = showTimeZone;
        this.recurrenceStatus = recurrenceStatus;
        this.formatted = formatted;
    }
}

class WixEvent {
    constructor({
        id,
        location,
        dateAndTimeSettings,
        title,
        shortDescription,
        detailedDescription,
        mainImage,
        slug,
        status,
        registration,
        calendarUrls,
        eventPageUrl,
        form,
        categories
    }) {
        this.id = id;
        this.location = new Location(location);
        this.dateAndTimeSettings = new DateAndTimeSettings(dateAndTimeSettings);
        this.title = title;
        this.shortDescription = shortDescription;
        this.detailedDescription = detailedDescription;
        this.mainImage = mainImage;
        this.slug = slug;
        this.status = status;
        this.registration = registration;
        this.calendarUrls = calendarUrls;
        this.eventPageUrl = eventPageUrl;
        this.form = form;
        this.categories = categories;
    }
}

module.exports = {
    WixEvent
};
