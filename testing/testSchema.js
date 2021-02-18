/**
 * Author: Quyen Vo
 * File name: testSchema.js
 * Last Date Modified: 16/2/2021
 * Purpose: Code to generate fake data for DB
 */
const mongoose = require("mongoose");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Booking = require("../models/Booking");
const Clinic = require("../models/Clinic");
const Qualification = require("../models/Qualification");
const Review = require("../models/Review");
const Service = require("../models/Service");
const Specialization = require("../models/Specialization");

const faker = require("faker");
const bcrypt = require("bcryptjs");

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const cleanData = async () => {
  try {
    console.log("Cleaning the database");
    await mongoose.connection.dropDatabase();
  } catch (error) {
    console.log(error);
  }
};

const createSpecialization = async () => {
  try {
    const specializations = [
      "Eye, Nose & Throat",
      "Cardiologist",
      "Dentist",
      "Dermatology",
    ];
    console.log(`CREATING ${specializations.length} SPECIALIZATIONS`);
    console.log("------------------------------");
    const specs = [];
    for (let i = 0; i < specializations.length; i++) {
      console.log(`CREATING ${specializations[i]}`);
      let spec = await Specialization.create({
        name: specializations[i],
      });

      specs.push(spec);
      console.log(`Created specialization ${spec._id}`);
    }

    console.log(`----- ${specs.length} SPECIALIZATIONS CREATED -----`);
    for (let i = 0; i < specs.length; i++) {
      console.log(specs[i]);
    }
    return specs;
  } catch (error) {
    console.log(error);
  }
};

const createQualification = async () => {
  try {
    const degrees = ["Bachelor", "Master", "Doctor", "Professor"];
    console.log(`CREATING ${degrees.length} QUALIFICATIONS`);
    console.log("------------------------------");
    const qualifications = [];
    for (let i = 0; i < degrees.length; i++) {
      console.log(`CREATING ${degrees[i]}`);
      let qual = await Qualification.create({
        name: degrees[i],
      });

      console.log(`Created qualification ${qual._id}`);
      qualifications.push(qual);
    }

    console.log(`----- ${qualifications.length} QUALIFICATIONS CREATED -----`);
    for (let i = 0; i < qualifications.length; i++) {
      console.log(qualifications[i]);
    }

    return qualifications;
  } catch (error) {
    console.log(error);
  }
};

const createClinicService = async () => {
  try {
    const sv = ["Medical Test", "Endoscopy", "ultrasonography"];
    console.log(`CREATING ${sv.length} SERVICES`);
    console.log("------------------------------");
    const services = [];
    for (let i = 0; i < sv.length; i++) {
      console.log(`CREATING ${sv[i]}`);
      let service = await Service.create({
        name: sv[i],
      });

      console.log(`Created service ${service._id}`);
      services.push(service);
    }

    console.log(`----- ${services.length} SERVICES CREATED -----`);
    for (let i = 0; i < services.length; i++) {
      console.log(services[i]);
    }

    return services;
  } catch (error) {
    console.log(error);
  }
};

const createRandomUsers = async (userNum) => {
  try {
    console.log(`CREATING ${userNum} RANDOM USERS`);
    console.log("--------------------------");
    const blood = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];
    const gender = ["Male", "Female", "Other"];
    const users = [];
    for (let i = 0; i < userNum; i++) {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash("123", salt);
      let user = await User.create({
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: password,
        avatarUrl: faker.image.food(),
        blood: blood[getRandomInt(0, blood.length - 1)],
        gender: gender[getRandomInt(0, gender.length - 1)],
        passportNum: faker.random.uuid(),
        job: faker.lorem.word(),
      });

      console.log(`Created user ${user._id}`);
      users.push(user);
    }

    console.log(`----- ${users.length} USERS CREATED -----`);
    for (let i = 0; i < users.length; i++) {
      console.log(users[i]);
    }

    return users;
  } catch (error) {
    console.log(error);
  }
};

const createRandomDoctors = async (
  qualifications,
  specializations,
  doctorsNum
) => {
  try {
    console.log(`CREATING ${doctorsNum} DOCTORS`);
    console.log("------------------------------");
    const doctors = [];
    const genders = ["Male", "Female", "Other"];
    const status = ["Working", "On leave"];

    for (let i = 0; i < doctorsNum; i++) {
      let qual = qualifications[getRandomInt(0, qualifications.length - 1)];
      let spec = specializations[getRandomInt(0, specializations.length - 1)];

      let doctor = await Doctor.create({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        avatarUrl: faker.image.cats(),
        gender: genders[getRandomInt(0, genders.length - 1)],
        status: status[getRandomInt(0, status.length - 1)],
        qualification: qual._id,
        specialization: [spec._id],
      });

      console.log(`Created doctor ${doctor._id}`);
      doctors.push(doctor);
    }

    console.log(`----- ${doctors.length} DOCTORS CREATED`);
    for (let i = 0; i < doctors.length; i++) {
      console.log(doctors[i]);
    }

    return doctors;
  } catch (error) {
    console.log(error);
  }
};

const createRandomClinic = async (
  doctors,
  services,
  specializations,
  clinicsNum
) => {
  try {
    console.log(`CREATING ${clinicsNum} CLINICS`);
    console.log("------------------------------");
    const languages = ["Vietnamese", "English", "Chinese", "Korean"];
    const clinics = [];
    // const salt = await bcrypt.genSalt(10);
    // const password = await bcrypt.hash("123", salt);
    const password = "123";
    for (let index = 0; index < clinicsNum; index++) {
      let images = [];
      for (let i = 0; i < 5; i++) {
        images.push(faker.image.business());
      }

      let specNum = getRandomInt(1, specializations.length - 1);
      let specs = [];
      for (let i = 0; i < specNum; i++) {
        specs.push(specializations[i]._id);
      }

      let svNum = getRandomInt(1, services.length - 1);
      let svs = [];
      for (let i = 0; i < svNum; i++) {
        svs.push(services[i]._id);
      }

      let docs = [];
      let docsNum = getRandomInt(1, doctors.length - 1);
      for (let i = 0; i < docsNum; i++) {
        let set = new Set();
        let index = getRandomInt(1, doctors.length - 1);
        while (set.has(index)) {
          index = getRandomInt(1, doctors.length - 1);
        }

        set.add(index);
        docs.push(doctors[i]._id);
      }

      let clinic = await Clinic.create({
        name: faker.company.companyName(),
        email: faker.internet.email().toLowerCase(),
        password: password,
        address: `${faker.address.streetAddress()} ${faker.address.streetName()}, ${faker.address.city()}`,
        startWorkingTime: getRandomInt(0, 1) === 0 ? "6AM" : "7AM",
        endWorkingTime: getRandomInt(0, 1) === 0 ? "8PM" : "9PM",
        languages: languages.slice(0, 2),
        registerNumber: faker.random.uuid(),
        statement: faker.lorem.paragraph(),
        images: images,
        specializations: specs,
        services: svs,
        doctors: docs,
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
      });

      console.log(`Created clinic ${clinic._id}`);

      clinics.push(clinic);
    }

    console.log(`----- CREATED ${clinics.length} CLINICS -----`);
    clinics.map((clinic) => console.log(clinic));

    return clinics;
  } catch (error) {
    console.log(error);
  }
};

const createRandomReview = async (users, clinics) => {
  try {
    console.log("CREATING 5 REVIEWS FOR EACH CLINIC");
    console.log("------------------------------");
    const reviews = [];
    for (let index = 0; index < clinics.length; index++) {
      let clinic = clinics[index];
      for (let i = 0; i < 5; i++) {
        let user = users[getRandomInt(0, users.length - 1)];
        console.log(
          `Creating review for user ${user._id} and clinic ${clinic._id}`
        );
        let review = await Review.create({
          user: user._id,
          clinic: clinic._id,
          content: faker.lorem.sentence(),
          rating: getRandomInt(1, 5),
        });

        reviews.push(review);
      }
    }

    console.log(`---------- CREATED ${reviews.length} REVIEWS ----------`);
    reviews.map((review) => console.log(review));
    return reviews;
  } catch (error) {
    console.log(error);
  }
};

const createRandomBooking = async (users, clinics) => {
  try {
    console.log("CREATING 10 BOOKINGS FOR EACH CLINIC");
    console.log("------------------------------");
    const status = ["Pending", "Active", "Cancelled", "Done"];
    const bookings = [];

    for (let index = 0; index < clinics.length; index++) {
      let clinic = clinics[index];
      let doctors = clinic.doctors;

      for (let i = 0; i < 100; i++) {
        let userIndex = getRandomInt(0, users.length - 1);
        let user = users[userIndex];

        let doctorIndex = getRandomInt(0, doctors.length - 1);
        let doctor = doctors[doctorIndex];
        console.log(
          `Creating booking for user ${user._id}, clinic ${clinic._id}, doctor ${doctor}`
        );

        let startTime = null;
        let endTime = null;
        let stat = null;

        if (i >= 0 && i < 40) {
          startTime = faker.date.between("2020-09-01", new Date());
          stat = "Done";
        } else if (i >= 40 && i < 50) {
          startTime = faker.date.soon(5, new Date());
          stat = "Pending";
        } else if (i >= 50 && i < 85) {
          startTime = faker.date.soon(3, new Date());
          stat = "Accepted";
        } else {
          startTime = faker.date.between("2021-01-01", new Date());
          stat = "Cancelled";
        }

        if (getRandomInt(0, 1) == 0) {
          startTime.setHours(getRandomInt(8, 10), 0, 0);
        } else {
          startTime.setHours(getRandomInt(13, 15), 0, 0);
        }
        endTime = new Date(startTime.getTime() + 3600 * 1000);
        let reason = faker.lorem.sentence();
        let booking = await Booking.create({
          user: user._id,
          clinic: clinic._id,
          doctor: doctor,
          startTime: startTime,
          endTime: endTime,
          status: stat,
          reason: reason,
        });

        bookings.push(booking);
      }
    }

    console.log(`----- CREATED ${bookings.length} BOOKINGS`);
    bookings.map((booking) => console.log(booking));
    return bookings;
  } catch (error) {
    console.log(error);
  }
};

const main = async (genData = false) => {
  if (genData) {
    await cleanData();
    const specializations = await createSpecialization();
    const services = await createClinicService();
    const qualifications = await createQualification();
    const users = await createRandomUsers(25);
    const doctors = await createRandomDoctors(
      qualifications,
      specializations,
      20
    );
    const clinics = await createRandomClinic(
      doctors,
      services,
      specializations,
      5
    );
    const reviews = await createRandomReview(users, clinics);
    const bookings = await createRandomBooking(users, clinics);
  }

  console.log("Successfully created fake data");
  let user = await User.find();
  let doctor = await Doctor.find();
  let clinic = await Clinic.find();
  let review = await Review.find();
  let service = await Service.find();
  let specialist = await Specialization.find();
  let qualification = await Qualification.find();
  let booking = await Booking.find();

  console.log(`User: ${user.length} users`);
  console.log(`Doctor: ${doctor.length} doctors`);
  console.log(`Clinic: ${clinic.length} clinics`);
  console.log(`Review: ${review.length} reviews`);
  console.log(`Service: ${service.length} services`);
  console.log(`Specialization: ${specialist.length} specializations`);
  console.log(`Qualification: ${qualification.length} qualification`);
  console.log(`Booking: ${booking.length} bookings`);

  console.log("Done!");
};

// main(true);
