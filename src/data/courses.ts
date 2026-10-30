import { LevelCurriculum } from '../app/core/models/course.model';

export const CURRICULUM_DATA: LevelCurriculum[] = [
  // ==========================================
  // LEVEL A1: Tech Survival & Daily Routine
  // ==========================================
  {
    level: 'A1',
    name: 'Tech Survival & Daily Routine',
    badge: '🚀 Junior Survival',
    summary: 'Essential phrases for surviving the first 30 days: standups, Slack presence, credentials, and git errors.',
    missions: [
      {
        id: 'a1-m1',
        level: 'A1',
        order: 1,
        title: 'Slack Comms: Running Late & Repository Access',
        scenarioType: 'slack',
        objective: 'Notify the team about a short delay and ask the lead for GitHub repository write access.',
        contextBackground: 'You just joined the squad. You are having VPN connectivity issues and need write permissions to push your branch.',
        dialogue: [
          {
            id: 'd1',
            speaker: 'You (Software Engineer)',
            role: 'Junior Fullstack Dev',
            speakerTone: 'casual',
            content: [
              'Hey team, ',
              {
                text: 'running 10 minutes late',
                translation: 'con 10 minutos de retraso',
                techContext: 'Standard courtesy in Slack/Teams #general or #standup channels.'
              },
              ' due to local network issues. ',
              {
                text: 'See you in the huddle!',
                translation: '¡Nos vemos en la videollamada rápida!',
                techContext: "'Huddle' is Slack's built-in audio call feature."
              }
            ],
            fullAudioText: 'Hey team, running 10 minutes late due to local network issues. See you in the huddle!'
          },
          {
            id: 'd2',
            speaker: 'Sarah (Tech Lead)',
            role: 'Lead Engineer',
            speakerTone: 'casual',
            content: [
              'No worries! By the way, remember to check your ',
              {
                text: 'repository permissions',
                translation: 'permisos del repositorio',
                techContext: 'Access levels in GitHub/GitLab: Read, Triage, Write, Admin.'
              },
              ' on GitHub. Did you get the invite?'
            ],
            fullAudioText: 'No worries! By the way, remember to check your repository permissions on GitHub. Did you get the invite?'
          },
          {
            id: 'd3',
            speaker: 'You (Software Engineer)',
            role: 'Junior Fullstack Dev',
            speakerTone: 'casual',
            content: [
              'Not yet. Could you please ',
              {
                text: 'grant me write access',
                translation: 'otorgarme acceso de escritura',
                techContext: 'Technical request to push commits directly or create branches.'
              },
              ' to the core repo? My handle is @dev-alvarez.'
            ],
            fullAudioText: 'Not yet. Could you please grant me write access to the core repo? My handle is @dev-alvarez.'
          }
        ],
        challenges: [
          {
            id: 'c1',
            type: 'multiple_choice',
            instruction: 'How do you announce on Slack that you will step away for lunch?',
            options: [
              {
                id: 'opt1',
                text: 'AFK for 45 min grabbing lunch. Will be back at 1:30 PM.',
                isCorrect: true,
                explanation: "'AFK' (Away From Keyboard) is universally understood in tech teams."
              },
              {
                id: 'opt2',
                text: 'I eat food now, goodbye everyone.',
                isCorrect: false,
                explanation: 'Grammatically rigid and unnatural in modern asynchronous software teams.'
              },
              {
                id: 'opt3',
                text: 'Disconnecting forever from the project server.',
                isCorrect: false,
                explanation: 'Sounds like quitting or shutting down infrastructure!'
              }
            ],
            xpReward: 25
          },
          {
            id: 'c2',
            type: 'fill_blank',
            instruction: 'Complete the daily standup status format:',
            contextSnippet: 'Yesterday I pushed the login fix. Today I am ___ the unit tests. I have no blockers.',
            blankTarget: 'writing',
            acceptedAnswers: ['writing', 'running', 'fixing'],
            xpReward: 35
          }
        ],
        xpReward: 100
      },
      {
        id: 'a1-m2',
        level: 'A1',
        order: 2,
        title: 'Git Terminal Diagnostics: Remote Origin Already Exists',
        scenarioType: 'terminal',
        objective: 'Diagnose common git setup errors and configure upstream origin smoothly.',
        contextBackground: 'You are initializing your local repository and attaching it to GitHub remote.',
        dialogue: [
          {
            id: 'd4',
            speaker: 'Terminal (Bash/Zsh)',
            role: 'System Output',
            speakerTone: 'urgent',
            content: [
              {
                text: 'fatal: remote origin already exists.',
                translation: 'error fatal: el remoto origin ya existe.',
                techContext: 'Occurs when git remote add origin is invoked on an already configured remote.'
              }
            ],
            fullAudioText: 'fatal: remote origin already exists.'
          },
          {
            id: 'd5',
            speaker: 'You (Internal Monologue / Pairing)',
            role: 'Software Engineer',
            content: [
              'I need to ',
              {
                text: 'inspect the remote url',
                translation: 'inspeccionar la url remota',
                techContext: 'Command: git remote -v'
              },
              ' or use ',
              {
                text: 'git remote set-url origin',
                translation: 'comando para cambiar la dirección del remoto existente',
                techContext: 'Updates the target URL without needing to delete and recreate the alias.'
              },
              ' to point to the company organization.'
            ],
            fullAudioText: 'I need to inspect the remote url or use git remote set-url origin to point to the company organization.'
          }
        ],
        challenges: [
          {
            id: 'c3',
            type: 'decision_tree',
            instruction: 'What command fixes the existing remote without deleting the .git directory?',
            decisionBranches: [
              {
                id: 'b1',
                decisionText: 'Run: git remote set-url origin <new-url>',
                consequence: 'Direct, clean update adhering to standard git workflows.',
                isOptimal: true,
                feedback: 'Optimal! Preserves commit logs and local staging state.',
                xpReward: 40
              },
              {
                id: 'b2',
                decisionText: 'Delete the entire project folder and clone again.',
                consequence: 'Loses unpushed stashes and local branch configs.',
                isOptimal: false,
                feedback: 'Inefficient and risks uncommitted work loss.',
                xpReward: 10
              }
            ],
            xpReward: 40
          }
        ],
        xpReward: 90
      }
    ]
  },

  // ==========================================
  // LEVEL A2: Routine Tasks & Issue Tracking
  // ==========================================
  {
    level: 'A2',
    name: 'Routine Tasks & Issue Tracking',
    badge: '📋 Agile Contributor',
    summary: 'Participate in Jira tickets, write clean pull request review comments, and coordinate with DevOps.',
    missions: [
      {
        id: 'a2-m1',
        level: 'A2',
        order: 1,
        title: 'Jira User Story & GitHub Code Review',
        scenarioType: 'jira',
        objective: 'Read reproduction steps on an issue and post actionable, polite feedback on a PR.',
        contextBackground: 'Bug report #PROD-402: NullReferenceException when payment method is empty during checkout.',
        dialogue: [
          {
            id: 'd6',
            speaker: 'Jira Ticket Description',
            role: 'Bug Report',
            content: [
              'Steps to reproduce: 1. Navigate to /checkout. 2. ',
              {
                text: 'Leave payment dropdown unselected',
                translation: 'Dejar el menú desplegable de pago sin seleccionar',
                techContext: 'Edge case triggering unguarded nullable properties.'
              },
              '. 3. Click Submit. Expected: validation error. Actual: 500 Internal Server Error.'
            ],
            fullAudioText: 'Steps to reproduce: 1. Navigate to checkout. 2. Leave payment dropdown unselected. 3. Click Submit. Expected: validation error. Actual: 500 Internal Server Error.'
          },
          {
            id: 'd7',
            speaker: 'You (GitHub PR Comment)',
            role: 'Code Reviewer',
            content: [
              'Good catch! However, there is a ',
              {
                text: 'missing null check',
                translation: 'falta una comprobación de nulo',
                techContext: 'Defensive programming check before dereferencing an object.'
              },
              ' on line 42. Could we use the ',
              {
                text: 'null-conditional operator ?.',
                translation: 'operador de condición nula (?.)',
                techContext: 'C# / TypeScript safe navigation operator.'
              },
              ' here to avoid throwing an exception?'
            ],
            fullAudioText: 'Good catch! However, there is a missing null check on line 42. Could we use the null-conditional operator here to avoid throwing an exception?'
          }
        ],
        challenges: [
          {
            id: 'c4',
            type: 'multiple_choice',
            instruction: 'How should you request a connection string from DevOps politely?',
            options: [
              {
                id: 'opt1',
                text: 'Hi Alex, could you share the staging database connection string so I can test ticket PROD-402?',
                isCorrect: true,
                explanation: 'Clear, gives context (staging environment + ticket number) and courteous.'
              },
              {
                id: 'opt2',
                text: 'Send me the database password right now.',
                isCorrect: false,
                explanation: 'Too aggressive and omits which environment or why.'
              }
            ],
            xpReward: 30
          }
        ],
        xpReward: 110
      }
    ]
  },

  // ==========================================
  // LEVEL B1: Independent Developer & Feature Delivery
  // ==========================================
  {
    level: 'B1',
    name: 'Independent Developer & Feature Delivery',
    badge: '💻 Autonomous Engineer',
    summary: 'Explain endpoints, defend sprint planning estimates, and write OpenAPI/Swagger documentation.',
    missions: [
      {
        id: 'b1-m1',
        level: 'B1',
        order: 1,
        title: 'Explaining Reactive Flows & Sprint Estimates',
        scenarioType: 'standup',
        objective: 'Describe how a modern reactive Angular signal or .NET Minimal API endpoint works.',
        contextBackground: 'Sprint Planning meeting: estimating an external payment gateway integration.',
        dialogue: [
          {
            id: 'd8',
            speaker: 'Scrum Master (Planning Poker)',
            role: 'Facilitator',
            content: [
              'You voted 5 story points for the Stripe webhook endpoint. ',
              {
                text: 'Could you justify the estimate?',
                translation: '¿Podrías justificar la estimación?',
                techContext: 'Standard agile planning prompt to explain architectural risks or complexity.'
              }
            ],
            fullAudioText: 'You voted 5 story points for the Stripe webhook endpoint. Could you justify the estimate?'
          },
          {
            id: 'd9',
            speaker: 'You (Software Engineer)',
            role: 'Mid-Level Fullstack Dev',
            content: [
              'Sure. We need to handle ',
              {
                text: 'idempotency keys',
                translation: 'claves de idempotencia',
                techContext: 'Ensures payment charges are not processed twice upon network retry.'
              },
              ' in the database, and verify the cryptographic signature before ',
              {
                text: 'dispatching the background job',
                translation: 'despachar la tarea en segundo plano',
                techContext: 'Asynchronous event processing using queues or worker services.'
              },
              '. Plus, writing integration tests with mock payloads will take extra care.'
            ],
            fullAudioText: 'Sure. We need to handle idempotency keys in the database, and verify the cryptographic signature before dispatching the background job. Plus, writing integration tests with mock payloads will take extra care.'
          }
        ],
        challenges: [
          {
            id: 'c5',
            type: 'fill_blank',
            instruction: 'Complete the Swagger endpoint summary:',
            contextSnippet: 'This endpoint validates the payload and returns 201 Created with an ___ response header.',
            blankTarget: 'ETag',
            acceptedAnswers: ['ETag', 'Location', 'Authorization'],
            xpReward: 40
          }
        ],
        xpReward: 120
      }
    ]
  },

  // ==========================================
  // LEVEL B2: Senior Collaboration, Pairing & Production
  // ==========================================
  {
    level: 'B2',
    name: 'Senior Collaboration, Pairing & Production',
    badge: '⚡ Senior Craftsman',
    summary: 'Navigate live pair programming, debate clean architecture tradeoffs, and deliver polished product demos.',
    missions: [
      {
        id: 'b2-m1',
        level: 'B2',
        order: 1,
        title: 'Live Pairing: Refactoring to LINQ & Clean Architecture',
        scenarioType: 'pairing',
        objective: 'Lead a live pair programming session to decouple business logic from infrastructure.',
        contextBackground: 'Refactoring a 300-line controller into Domain Use Cases and LINQ queries in C#.',
        dialogue: [
          {
            id: 'd10',
            speaker: 'Peer Developer',
            role: 'Backend Engineer',
            content: [
              'Notice this nested foreach loop. It executes an N+1 SQL query inside memory. How should we refactor it?'
            ],
            fullAudioText: 'Notice this nested foreach loop. It executes an N+1 SQL query inside memory. How should we refactor it?'
          },
          {
            id: 'd11',
            speaker: 'You (Senior Dev)',
            role: 'Pair Lead',
            content: [
              'Let us ',
              {
                text: 'decouple this logic into a specification',
                translation: 'desacoplar esta lógica en una especificación',
                techContext: 'Specification pattern encapsulating query business rules.'
              },
              ' and use ',
              {
                text: 'AsNoTracking with projection',
                translation: 'AsNoTracking con proyección',
                techContext: 'Entity Framework Core performance optimization avoiding state tracking.'
              },
              '. That way, we load only the required DTO fields in a single round-trip.'
            ],
            fullAudioText: 'Let us decouple this logic into a specification and use AsNoTracking with projection. That way, we load only the required DTO fields in a single round-trip.'
          }
        ],
        challenges: [
          {
            id: 'c6',
            type: 'multiple_choice',
            instruction: 'In a Sprint Retrospective, how do you address code review delays constructively?',
            options: [
              {
                id: 'opt1',
                text: 'PR turnaround time has become a bottleneck. Could we institute a team WIP limit and cap PR sizes at 300 lines?',
                isCorrect: true,
                explanation: 'Constructive, actionable, focuses on system mechanics (WIP limit) rather than blaming individuals.'
              },
              {
                id: 'opt2',
                text: 'People take 4 days to review my PRs and it makes me angry.',
                isCorrect: false,
                explanation: 'Emotion-driven, confrontational, doesn’t suggest structural solutions.'
              }
            ],
            xpReward: 50
          }
        ],
        xpReward: 150
      }
    ]
  },

  // ==========================================
  // LEVEL C1: Tech Lead, System Architecture & Incidents
  // ==========================================
  {
    level: 'C1',
    name: 'Tech Lead, System Architecture & Incidents',
    badge: '🛡️ Staff Architect & Incident Commander',
    summary: 'Lead Sev-1 incident war rooms, author system design RFCs, and push back on technical debt with product management.',
    missions: [
      {
        id: 'c1-m1',
        level: 'C1',
        order: 1,
        title: 'War Room: Sev-1 Database Outage & Rollback Triage',
        scenarioType: 'war_room',
        objective: 'Command an emergency live call during production failure, establish root cause, and orchestrate safe rollback.',
        contextBackground: 'Production API latency spiked to 12,000ms. Database connection pool exhausted after a migration deploy.',
        dialogue: [
          {
            id: 'd12',
            speaker: 'Incident Commander (You)',
            role: 'Staff Engineer',
            speakerTone: 'urgent',
            content: [
              'All right folks, this is a ',
              {
                text: 'Sev-1 incident',
                translation: 'incidente de Severidad 1 (crítico)',
                techContext: 'Highest severity tier: revenue or core business operation is paralyzed.'
              },
              '. Latency is at 12 seconds. Dave, please ',
              {
                text: 'freeze the deployment pipeline',
                translation: 'congelar el pipeline de despliegue',
                techContext: 'Halts in-flight automated CI/CD builds to prevent compounding failures.'
              },
              '. We are seeing ',
              {
                text: 'connection pool exhaustion',
                translation: 'agotamiento del grupo de conexiones',
                techContext: 'All database connections are leased, blocking incoming HTTP threads.'
              },
              '.'
            ],
            fullAudioText: 'All right folks, this is a Sev-1 incident. Latency is at 12 seconds. Dave, please freeze the deployment pipeline. We are seeing connection pool exhaustion.'
          },
          {
            id: 'd13',
            speaker: 'DevOps Lead',
            role: 'Infrastructure',
            content: [
              'Confirmed. The migration created an unindexed foreign key lock. Should we roll back or fail over to the read replica?'
            ],
            fullAudioText: 'Confirmed. The migration created an unindexed foreign key lock. Should we roll back or fail over to the read replica?'
          },
          {
            id: 'd14',
            speaker: 'Incident Commander (You)',
            role: 'Staff Engineer',
            content: [
              'We will ',
              {
                text: 'orchestrate an immediate blue-green rollback',
                translation: 'orquestar un rollback inmediato azul-verde',
                techContext: 'Switching traffic back to the previous stable container/cluster target.'
              },
              ' to version 2.4.1. Then we kill idle locks. ',
              {
                text: 'I will post an async status update',
                translation: 'publicaré una actualización asíncrona de estado',
                techContext: 'Proactive transparent stakeholder communication every 15 minutes.'
              },
              ' on the #incident-prod channel.'
            ],
            fullAudioText: 'We will orchestrate an immediate blue-green rollback to version 2.4.1. Then we kill idle locks. I will post an async status update on the incident-prod channel.'
          }
        ],
        challenges: [
          {
            id: 'c7',
            type: 'decision_tree',
            instruction: 'How do you negotiate delaying a feature with the Product Manager to pay down critical technical debt?',
            decisionBranches: [
              {
                id: 'b1',
                decisionText: 'Frame the trade-off in terms of SLA risk, MTTR, and feature velocity drop.',
                consequence: 'The PM understands that unaddressed debt will delay future sprint roadmaps by 40%.',
                isOptimal: true,
                feedback: 'Exceptional staff-level communication. Align engineering reality with business metrics.',
                xpReward: 60
              },
              {
                id: 'b2',
                decisionText: 'Tell the PM that clean code is inherently superior and refusal is unprofessional.',
                consequence: 'Creates ideological friction without quantifying business value.',
                isOptimal: false,
                feedback: 'Product managers prioritize business outcomes, not aesthetic purity.',
                xpReward: 15
              }
            ],
            xpReward: 70
          }
        ],
        xpReward: 180
      }
    ]
  },

  // ==========================================
  // LEVEL C2: Strategic & Executive Leadership
  // ==========================================
  {
    level: 'C2',
    name: 'Strategic & Executive Leadership',
    badge: '🌐 Principal / VP of Engineering',
    summary: 'Defend cloud budgets before the CFO, defuse organizational cross-team friction, and present technical vision keynotes.',
    missions: [
      {
        id: 'c2-m1',
        level: 'C2',
        order: 1,
        title: 'CFO Presentation: Cloud Cost Optimization & FinOps',
        scenarioType: 'exec_pitch',
        objective: 'Defend infrastructure expenditure by articulating ROI, reserved instances, and serverless economies of scale.',
        contextBackground: 'Executive Board Meeting: The CFO questions why AWS/Azure cloud compute grew by 28% last quarter.',
        dialogue: [
          {
            id: 'd15',
            speaker: 'Chief Financial Officer (CFO)',
            role: 'Executive',
            content: [
              'Our cloud consumption hit $120,000 this month. Why are our margins eroding, and what is the return on this architecture?'
            ],
            fullAudioText: 'Our cloud consumption hit 120,000 dollars this month. Why are our margins eroding, and what is the return on this architecture?'
          },
          {
            id: 'd16',
            speaker: 'You (Principal Architect)',
            role: 'VP / Principal Engineer',
            content: [
              'Thank you for bringing that up. That 28% increase corresponds to a ',
              {
                text: '140% surge in active transaction volume',
                translation: 'un aumento del 140% en el volumen de transacciones activas',
                techContext: 'Unit economics: compute cost per user transaction actually dropped.'
              },
              '. By moving to ',
              {
                text: 'three-year savings plans and reserved instances',
                translation: 'planes de ahorro a tres años e instancias reservadas',
                techContext: 'Cloud cost governance (FinOps) locking in discounts up to 60%.'
              },
              ', alongside ',
              {
                text: 'auto-scaling serverless containers',
                translation: 'contenedores serverless con autoescalado',
                techContext: 'Elastic compute scaling down to zero during off-peak hours.'
              },
              ', we project an annualized 32% net margin improvement.'
            ],
            fullAudioText: 'Thank you for bringing that up. That 28% increase corresponds to a 140% surge in active transaction volume. By moving to three-year savings plans and reserved instances, alongside auto-scaling serverless containers, we project an annualized 32% net margin improvement.'
          }
        ],
        challenges: [
          {
            id: 'c8',
            type: 'multiple_choice',
            instruction: 'How do you open a corporate keynote on AI agentic adoption for a global engineering summit?',
            options: [
              {
                id: 'opt1',
                text: 'Engineering excellence is not about writing more lines of code faster; it is about amplifying human judgment, architectural rigor, and velocity through autonomous tooling.',
                isCorrect: true,
                explanation: 'Inspiring, strategically sound, establishes high engineering standards.'
              },
              {
                id: 'opt2',
                text: 'AI will replace everyone unless you start using modern copilot shortcuts today.',
                isCorrect: false,
                explanation: 'Alarmist, lacks executive presence and strategic depth.'
              }
            ],
            xpReward: 60
          }
        ],
        xpReward: 200
      }
    ]
  }
];
