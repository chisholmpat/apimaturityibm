/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Forms from '../api/forms/forms.model';
import Clients from '../api/clients/clients.model';

var demoTemplate = [{
    name: 'Default Template',
    description: 'This is the default API-Maturity survey.',
    assessment: [{
      name: 'Business',
      questions: [{
        question: 'TestQuestionOne',
        answerArray: ['1','2','3'],
        category: 'selfAssessment',
        grouping: 'ad-hoc'
      },
      {
        question: 'TestQuestionTwo',
        answerArray: ['1','2','3'],
        category: 'quantitativeAssessment',
        grouping: 'business'
      }]
    }, {
      name: 'Governance',
      questions: [{
        question: 'TestQuestionOne',
        answerArray: ['1','2','3'],
        category: 'selfAssessment',
        grouping: 'ad-hoc'
      },
      {
        question: 'TestQuestionTwo',
        answerArray: ['1','2','3'],
        category: 'quantitativeAssessment',
        grouping: 'business'
      }]
    }, {
      name: 'Architecture',
      questions: [{
        question: 'TestQuestionOne',
        answerArray: ['1','2','3'],
        category: 'selfAssessment',
        grouping: 'ad-hoc'
      },
      {
        question: 'TestQuestionTwo',
        answerArray: ['1','2','3'],
        category: 'quantitativeAssessment',
        grouping: 'business'
      }]
    }, {
      name: 'Information and Content',
      questions: [{
        question: 'TestQuestionOne',
        answerArray: ['1','2','3'],
        category: 'selfAssessment',
        grouping: 'ad-hoc'
      },
      {
        question: 'TestQuestionTwo',
        answerArray: ['1','2','3'],
        category: 'quantitativeAssessment',
        grouping: 'business'
      }]
    }, {
      name: 'Dev Ops',
      questions: [{
        question: 'TestQuestionOne',
        answerArray: ['1','2','3'],
        category: 'selfAssessment',
        grouping: 'ad-hoc'
      },
      {
        question: 'TestQuestionTwo',
        answerArray: ['1','2','3'],
        category: 'quantitativeAssessment',
        grouping: 'business'
      }]  
    }, {
      name: 'Infrastructure',
      questions: [{
        question: 'TestQuestionOne',
        answerArray: ['1','2','3'],
        category: 'selfAssessment',
        grouping: 'ad-hoc'
      },
      {
        question: 'TestQuestionTwo',
        answerArray: ['1','2','3'],
        category: 'quantitativeAssessment',
        grouping: 'business'
      }]
    }]
}];

var demoAssessment = [{
    name: 'TestAssessment',
    description: 'This is the default API-Maturity survey.',
    assessment: [{
      name: 'Business',
      questions: [{
        question: 'TestQuestionOne',
        answerArray: ['1','2','3'],
        category: 'selfAssessment',
        grouping: 'ad-hoc'
      },
      {
        question: 'TestQuestionTwo',
        answerArray: ['1','2','3'],
        category: 'quantitativeAssessment',
        grouping: 'business'
      }]
    }, {
      name: 'Governance',
      questions: [{
        question: 'TestQuestionOne',
        answerArray: ['1','2','3'],
        category: 'selfAssessment',
        grouping: 'ad-hoc'
      },
      {
        question: 'TestQuestionTwo',
        answerArray: ['1','2','3'],
        category: 'quantitativeAssessment',
        grouping: 'business'
      }]
    }, {
      name: 'Architecture',
      questions: [{
        question: 'TestQuestionOne',
        answerArray: ['1','2','3'],
        category: 'selfAssessment',
        grouping: 'ad-hoc'
      },
      {
        question: 'TestQuestionTwo',
        answerArray: ['1','2','3'],
        category: 'quantitativeAssessment',
        grouping: 'business'
      }]
    }, {
      name: 'Information and Content',
      questions: [{
        question: 'TestQuestionOne',
        answerArray: ['1','2','3'],
        category: 'selfAssessment',
        grouping: 'ad-hoc'
      },
      {
        question: 'TestQuestionTwo',
        answerArray: ['1','2','3'],
        category: 'quantitativeAssessment',
        grouping: 'business'
      }]
    }, {
      name: 'Dev Ops',
      questions: [{
        question: 'TestQuestionOne',
        answerArray: ['1','2','3'],
        category: 'selfAssessment',
        grouping: 'ad-hoc'
      },
      {
        question: 'TestQuestionTwo',
        answerArray: ['1','2','3'],
        category: 'quantitativeAssessment',
        grouping: 'business'
      }]  
    }, {
      name: 'Infrastructure',
      questions: [{
        question: 'TestQuestionOne',
        answerArray: ['1','2','3'],
        category: 'selfAssessment',
        grouping: 'ad-hoc'
      },
      {
        question: 'TestQuestionTwo',
        answerArray: ['1','2','3'],
        category: 'quantitativeAssessment',
        grouping: 'business'
      }]
    }]
}];

var demoClient = [{
  name: 'Big Box Tech',
  industry: 'Tech',
  contact: 'Peter C',
  email: 'ex@ex.com',
  phone: '18007775555',
  country: 'Canada',
  revenue: 1000000,
  industry_segment: 'tech',
  market_share: 400,
  market_capitalization: 4,
  competitors: 'me',
  active: false,
  assessments: demoAssessment
}];

Clients.find({}).remove()
  .then(() => {
    Clients.create({
      name: 'Big Box Tech',
      industry: 'Tech',
      contact: 'Peter C',
      email: 'ex@ex.com',
      phone: '18007775555',
      country: 'Canada',
      revenue: 1000000,
      industry_segment: 'tech',
      market_share: 400,
      market_capitalization: 4,
      competitors: 'me',
      active: false,
      assessments: demoAssessment
    });
});

User.find({}).remove()
  .then(() => {
    User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin',
      clients: demoClient, 
      assessmentTemplates: demoTemplate
    })
    .then(() => {
      console.log('finished populating users');
    });
});