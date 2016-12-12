/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Forms from '../api/forms/forms.model';
import Clients from '../api/clients/clients.model';
import Assessments from '../api/assessments/assessments.model'
// import demoTemp from '../api/user/default_template.seed.js'

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

var defaultTemplate = [{
    name: 'API-Maturity Template',
    description: 'This is the default API-Maturity survey.',
    master: true,
    assessment: [{
      name: 'Business',
      questions: [{
        question: 'Ad hoc',
        category: 'Self-Assessment',
      },
      {
        question: 'Provider',
        category: 'Self-Assessment',
      },
      {
        question: 'Consumer',
        category: 'Self-Assessment',
      },
      {
        question: 'Business',
        category: 'Self-Assessment',
      },
      {
        question: 'Market',
        category: 'Self-Assessment',
      },
      {
        question: 'Capture Business and Technical API measurements or metrics',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Do you have Categories of Business and Technical API measurements or metrics',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Capture KPIs that determine the business value of applications',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Technology Investment in place for the development of APIs',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Well defined teams for developing new applications',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'A prioritized list of future APIs has been budgeted',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Clear owner of the Service API model/Service API catalog',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Governance in place to monitor, manage, update, create enhanced capabilities of APIs',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Defined group for the responsibility of managing API dependencies (internal and external)',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'New API functionality capabilities for the business with delivery roadmap',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Legal issues are addressed with the API services (existing or new development)',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'New business API capabilities are planned for Mobile, Cloud, Analytics, and IOT.',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'API capabilities are devliered to the Associate/Manager within a business store or branch location',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'API location dependencies and geofencing policies are in place.',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'API are used to capture and deliver analytics to the managers or business associates.',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Business APIs are viewed by Executive Management as a way to grow the business (customer advocacy, improved effeciency, or new revenue',
        category: 'Quantitative-Assessment',
      }]
    }, {
      name: 'Governance',
      questions: [{
        question: 'Ad hoc',
        category: 'Self-Assessment',
      },
      {
        question: 'Provider',
        category: 'Self-Assessment',
      },
      {
        question: 'Consumer',
        category: 'Self-Assessment',
      },
      {
        question: 'Business',
        category: 'Self-Assessment',
      },
      {
        question: 'Market',
        category: 'Self-Assessment',
      },
      {
        question: 'Governance processes implemented that allow reusability and common data elements',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Policy mechanisms and controls established for empowering people to fulfil roles and responsibilities for API governance',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Levels of communications are in place for API governance',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Tools, technologies, and processes are in place to support API governance',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'API Catalog which maintains the functionality and capabilities of the APIs',
        category: 'Quantitative-Assessment',
      }]
    }, {
      name: 'Architecture',
      questions: [{
        question: 'Ad hoc',
        category: 'Self-Assessment',
      },
      {
        question: 'Provider',
        category: 'Self-Assessment',
      },
      {
        question: 'Consumer',
        category: 'Self-Assessment',
      },
      {
        question: 'Business',
        category: 'Self-Assessment',
      },
      {
        question: 'Market',
        category: 'Self-Assessment',
      },
      {
        question: 'The Network capacity, latency and bandwidth has been planned for API traffic',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Framework, Platforms and Design Principles exist to guide API development',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Privacy, Data Protection & Security for APIs has been addressed',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'High use API compositions has been addressed',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Design guidance is provided for API granularity',
        category: 'Quantitative-Assessment',
      }]
    }, {
      name: 'Information and Content',
      questions: [{
        question: 'Ad hoc',
        category: 'Self-Assessment',
      },
      {
        question: 'Provider',
        category: 'Self-Assessment',
      },
      {
        question: 'Consumer',
        category: 'Self-Assessment',
      },
      {
        question: 'Business',
        category: 'Self-Assessment',
      },
      {
        question: 'Market',
        category: 'Self-Assessment',
      },
      {
        question: 'Processes established for versioning and release levels for the APIs',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Industry standard processes and methodology are being followed',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Engineering and deployment & operational organizations aware of one another processes, lead times & dependencies',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Process is in place for measuring data quality',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Ownership of APIs and data has been defined',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Agreements between business consumers and API producers for API service level targets are in place',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Parameterization practices for designing the APIs are in place',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Design of API’s with respect to the coupling between the client (API consumer) and services (API) and internally have been defined',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Communication and process for integration between the engineering organization and deployment & operational organization are in place',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Processes and life cycle steps/methodology for API exist (Design, Development, Deployment)',
        category: 'Quantitative-Assessment',
      }]
    }, {
      name: 'Dev Ops',
      questions: [{
        question: 'Ad hoc',
        category: 'Self-Assessment',
      },
      {
        question: 'Provider',
        category: 'Self-Assessment',
      },
      {
        question: 'Consumer',
        category: 'Self-Assessment',
      },
      {
        question: 'Business',
        category: 'Self-Assessment',
      },
      {
        question: 'Market',
        category: 'Self-Assessment',
      },
      {
        question: 'DevOps Environment supporting API Lifecycle',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Automated DevOps Environment',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'APIs are fully managed with process and tools',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Operational environment manages the lifecycle of support associated with API integration and runtime',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Governance and SLA policies are being observed with active monitoring',
        category: 'Quantitative-Assessment',
      }]  
    }, {
      name: 'Infrastructure',
      questions: [{
        question: 'Ad hoc',
        category: 'Self-Assessment',
      },
      {
        question: 'Provider',
        category: 'Self-Assessment',
      },
      {
        question: 'Consumer',
        category: 'Self-Assessment',
      },
      {
        question: 'Business',
        category: 'Self-Assessment',
      },
      {
        question: 'Market',
        category: 'Self-Assessment',
      },
      {
        question: 'Manage API QoS is on an API basis',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Network designed to reduce latencies and bandwidth constraints',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'API gateways and appliances facilitate API Management',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Caching layers to support API call acceleration are in place',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Federated Identity and Access Management strategy and implementation',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Proper network segmentation and zoning to support internal, external, and partner traffic',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Infrastructure is designed to meet the levels of availability required for the APIs',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'API appliances meet the desired performance for API consumers',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Infrastructure automation for deploying updates or new APIs are in place',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Infrastructure API workloads are agile and elastic to meet consumer demands',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'APIs and data support the necessary regulatory compliances',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Automated metering and billing is supported by the Infrastructure',
        category: 'Quantitative-Assessment',
      }]
    }]
}];

var demoAssessment = [{
    name: 'My First Assesment',
    description: 'This is the default API-Maturity survey.',
    tempName: 'API-Maturity Template',
    assessment: [{
      name: 'Business',
      questions: [{
        question: 'Ad hoc',
        category: 'Self-Assessment',
      },
      {
        question: 'Provider',
        category: 'Self-Assessment',
      },
      {
        question: 'Consumer',
        category: 'Self-Assessment',
      },
      {
        question: 'Business',
        category: 'Self-Assessment',
      },
      {
        question: 'Market',
        category: 'Self-Assessment',
      },
      {
        question: 'Capture Business and Technical API measurements or metrics',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Do you have Categories of Business and Technical API measurements or metrics',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Capture KPIs that determine the business value of applications',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Technology Investment in place for the development of APIs',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Well defined teams for developing new applications',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'A prioritized list of future APIs has been budgeted',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Clear owner of the Service API model/Service API catalog',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Governance in place to monitor, manage, update, create enhanced capabilities of APIs',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Defined group for the responsibility of managing API dependencies (internal and external)',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'New API functionality capabilities for the business with delivery roadmap',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Legal issues are addressed with the API services (existing or new development)',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'New business API capabilities are planned for Mobile, Cloud, Analytics, and IOT.',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'API capabilities are devliered to the Associate/Manager within a business store or branch location',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'API location dependencies and geofencing policies are in place.',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'API are used to capture and deliver analytics to the managers or business associates.',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Business APIs are viewed by Executive Management as a way to grow the business (customer advocacy, improved effeciency, or new revenue',
        category: 'Quantitative-Assessment',
      }]
    }, {
      name: 'Governance',
      questions: [{
        question: 'Ad hoc',
        category: 'Self-Assessment',
      },
      {
        question: 'Provider',
        category: 'Self-Assessment',
      },
      {
        question: 'Consumer',
        category: 'Self-Assessment',
      },
      {
        question: 'Business',
        category: 'Self-Assessment',
      },
      {
        question: 'Market',
        category: 'Self-Assessment',
      },
      {
        question: 'Governance processes implemented that allow reusability and common data elements',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Policy mechanisms and controls established for empowering people to fulfil roles and responsibilities for API governance',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Levels of communications are in place for API governance',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Tools, technologies, and processes are in place to support API governance',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'API Catalog which maintains the functionality and capabilities of the APIs',
        category: 'Quantitative-Assessment',
      }]
    }, {
      name: 'Architecture',
      questions: [{
        question: 'Ad hoc',
        category: 'Self-Assessment',
      },
      {
        question: 'Provider',
        category: 'Self-Assessment',
      },
      {
        question: 'Consumer',
        category: 'Self-Assessment',
      },
      {
        question: 'Business',
        category: 'Self-Assessment',
      },
      {
        question: 'Market',
        category: 'Self-Assessment',
      },
      {
        question: 'The Network capacity, latency and bandwidth has been planned for API traffic',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Framework, Platforms and Design Principles exist to guide API development',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Privacy, Data Protection & Security for APIs has been addressed',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'High use API compositions has been addressed',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Design guidance is provided for API granularity',
        category: 'Quantitative-Assessment',
      }]
    }, {
      name: 'Information and Content',
      questions: [{
        question: 'Ad hoc',
        category: 'Self-Assessment',
      },
      {
        question: 'Provider',
        category: 'Self-Assessment',
      },
      {
        question: 'Consumer',
        category: 'Self-Assessment',
      },
      {
        question: 'Business',
        category: 'Self-Assessment',
      },
      {
        question: 'Market',
        category: 'Self-Assessment',
      },
      {
        question: 'Processes established for versioning and release levels for the APIs',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Industry standard processes and methodology are being followed',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Engineering and deployment & operational organizations aware of one another processes, lead times & dependencies',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Process is in place for measuring data quality',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Ownership of APIs and data has been defined',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Agreements between business consumers and API producers for API service level targets are in place',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Parameterization practices for designing the APIs are in place',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Design of API’s with respect to the coupling between the client (API consumer) and services (API) and internally have been defined',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Communication and process for integration between the engineering organization and deployment & operational organization are in place',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Processes and life cycle steps/methodology for API exist (Design, Development, Deployment)',
        category: 'Quantitative-Assessment',
      }]
    }, {
      name: 'Dev Ops',
      questions: [{
        question: 'Ad hoc',
        category: 'Self-Assessment',
      },
      {
        question: 'Provider',
        category: 'Self-Assessment',
      },
      {
        question: 'Consumer',
        category: 'Self-Assessment',
      },
      {
        question: 'Business',
        category: 'Self-Assessment',
      },
      {
        question: 'Market',
        category: 'Self-Assessment',
      },
      {
        question: 'DevOps Environment supporting API Lifecycle',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Automated DevOps Environment',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'APIs are fully managed with process and tools',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Operational environment manages the lifecycle of support associated with API integration and runtime',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Governance and SLA policies are being observed with active monitoring',
        category: 'Quantitative-Assessment',
      }]  
    }, {
      name: 'Infrastructure',
      questions: [{
        question: 'Ad hoc',
        category: 'Self-Assessment',
      },
      {
        question: 'Provider',
        category: 'Self-Assessment',
      },
      {
        question: 'Consumer',
        category: 'Self-Assessment',
      },
      {
        question: 'Business',
        category: 'Self-Assessment',
      },
      {
        question: 'Market',
        category: 'Self-Assessment',
      },
      {
        question: 'Manage API QoS is on an API basis',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Network designed to reduce latencies and bandwidth constraints',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'API gateways and appliances facilitate API Management',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Caching layers to support API call acceleration are in place',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Federated Identity and Access Management strategy and implementation',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Proper network segmentation and zoning to support internal, external, and partner traffic',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Infrastructure is designed to meet the levels of availability required for the APIs',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'API appliances meet the desired performance for API consumers',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Infrastructure automation for deploying updates or new APIs are in place',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Infrastructure API workloads are agile and elastic to meet consumer demands',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'APIs and data support the necessary regulatory compliances',
        category: 'Quantitative-Assessment',
      },
      {
        question: 'Automated metering and billing is supported by the Infrastructure',
        category: 'Quantitative-Assessment',
      }]
    }]
}];

var rand = function randomScores(demoAssessment) {
  for (var i = 0; i < demoAssessment.length; i++) {
    for (var j = 0; j < demoAssessment[i].assessment.length; j++) {
      for (var q = 0; q < demoAssessment[i].assessment[j].questions.length; q++) {
        if (demoAssessment[i].assessment[j].questions[q].category === 'Quantitative-Assessment')
          demoAssessment[i].assessment[j].questions[q].answer = randomIntFromInterval(1,5);
        else 
          demoAssessment[i].assessment[j].questions[q].answer = randomIntFromInterval(1,3);
      }
    }
  }
  console.log(demoAssessment);
  return demoAssessment;
}//End randomScores

var d1 = rand(demoAssessment);
var d2 = rand(demoAssessment);
var d3 = rand(demoAssessment);

var demoClient = {
  name: 'Big Box Tech',
  industry: 'Banking',
  contact: 'Peter C',
  email: 'peter@bigboxtech.ca',
  phone: '18007775555',
  country: 'Canada',
  revenue: 1000000,
  industry_segment: 'tech',
  market_share: 400,
  market_capitalization: 4,
  competitors: 'Small Box Corp, Medium Box Inc',
  active: false,
  assessments: d1
};



var demoClient1 = {
  name: 'Cubex Corporation',
  industry: 'Electronics',
  contact: 'Mike F',
  email: 'mike@cubex.com',
  phone: '18003334444',
  country: 'United States of America',
  revenue: 3000000,
  industry_segment: 'Emergent Disease Analysis',
  market_share: 500,
  market_capitalization: 200,
  competitors: 'Squarex, Triex',
  active: false,
  assessments: d2
};


var demoClient2 = {
  name: 'Data Doctors Inc',
  industry: 'Automotive',
  contact: 'Wendy S',
  email: 'wendy@datadoctors.com',
  phone: '18009992233',
  country: 'Mexico',
  revenue: 50000000,
  industry_segment: 'NoSQL DBMS Systems',
  market_share: 700,
  market_capitalization: 500,
  competitors: 'Data Shark Corp, Data Masters Inc',
  active: false,
  assessments: d3
};



var clientArray = [demoClient, demoClient1, demoClient2];

Assessments.find({}).remove()
  .then(() => {
    Assessments.create({
      name: 'API-Maturity Template',
      description: 'This is the default API-Maturity survey.',
      assessment: defaultTemplate[0].assessment
    });
  });

User.find({}).remove()
  .then(() => {
    User.create({
      provider: 'local',
      name: 'Test User',
      firstName: 'Mike',
      lastName: 'Smith',
      email: 'test@example.com',
      password: 'test',
      clients: clientArray, 
      assessmentTemplates: defaultTemplate
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      firstName: 'Patrick',
      lastName: 'Chisholm',
      email: 'admin@example.com',
      password: 'admin',
      clients: clientArray, 
      assessmentTemplates: defaultTemplate
    })
    .then((users) => {
      console.log('finished populating users');
    });
});



