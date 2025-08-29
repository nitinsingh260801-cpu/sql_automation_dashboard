`{
  "name": "dashboard_chatbot",
  "nodes": [
    {
      "parameters": {
        "sendTo": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('To', ``, 'string') }}",
        "subject": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Subject', ``, 'string') }}",
        "message": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Message', ``, 'string') }}",
        "options": {
          "appendAttribution": false
        }
      },
      "type": "n8n-nodes-base.gmailTool",
      "typeVersion": 2.1,
      "position": [
        192,
        160
      ],
      "id": "9ada44da-b15a-449c-83ab-96d48355191f",
      "name": "Send a message in Gmail1",
      "webhookId": "90c3a7e2-1b84-4c7e-88dc-75bf57772736",
      "credentials": {
        "gmailOAuth2": {
          "id": "KAT9vqaQezJnuxqa",
          "name": "Gmail account"
        }
      }
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "=you are my assistant. Always reply in the same language and style that the user uses. Default language is English\nIf the user writes in Hindi using English letters (Hinglish), reply in Hinglish. Or the language used by the user.\nUser message:\n{{ $json.body.message || $json.body.query || $json.body.text || 'No message provided' }}",
        "options": {
          "systemMessage": "=You are an enterprise assistant helping users access information and send email notifications.\n\nDefault language is English.\n\nYou are tasked with answering a question using the information within the database and sending email notifications to clients as required.\n\nCall the \"Get tables, schemas, columns, and foreign keys\" to get the schema for \"gtpl_114_gt_140e_s7_1200\".\n\nCore Process\nRead the message: Understand what the user is asking for or reporting.\n\nReview the sheet: Use the read tool to get current data from the SQL database (gtpl_114_gt_140e_s7_1200 table).\n\nAnalyze: Determine what information needs to be updated, added, or modified, and decide if an email needs to be sent.\n\nUpdate: Use the update tool to make necessary changes in the database.\n\nSend Email: If the message involves emailing a client, use the Gmail send message tool to send an email.\n\nConfirm: Briefly explain what you updated and if an email was sent.\n\nAvailable Tools\nread_postgres: Retrieves current data from the SQL database (gtpl_114_gt_140e_s7_1200 table)\n\nupdate_sql: Updates specific cells or ranges in the database\n\n'Gmail send message tool': Sends the email whenever the user requests for communication with clients.\n\nGuidelines\nAlways read the database first before making any updates or sending emails.\n\nOnly update information that has actually changed or is newly provided.\n\nWhen sending an email, ensure the content is personalized and relevant to the client (use data from the Clients and Email columns).\n\nBe precise with your updates – don't modify unrelated data.\n\nIf the message is unclear, ask for clarification before updating or sending an email.\n\nProvide a brief summary of what you updated or sent after making changes.\n\nIf given Client's Name in lower case, still process the request instead of replying no user found.\n\nEmail Sending Process\nWhen sending an email to a client, use the email stored in the Email column.\n\nThe email subject and content should be professional and relevant to the client's status or the update in their data.\n\nEnsure the message is concise and includes all necessary details (e.g., client name, status update, or product information).\n\nUse personalization in emails by addressing the client using the name from the Clients column.\n\nResponse Format\nRead the current database data:\n\nRetrieve relevant data based on the request or client information.\n\nIdentify what needs updating:\n\nBased on the message, determine which fields need modification.\n\nMake the necessary updates:\n\nIf an update is required, make the necessary changes in the database using the update_postgres tool.\n\nSend an email (if required):\n\nUse the Gmail send message tool to send an email to the client, ensuring all relevant details are included in the message.\n\nConfirm:\n\n\"Updated [specific information] in the database.\"\n\nIf an email is sent, confirm: \"Email sent to [Client Name] at [Email].\"\n\nSometimes the output length may exceed 4096 character, if that happens you will just ask the user to show just the important part if they reply yes then show only the important part to the user. \n\nWhatever the messages you will be sending will be from the side of Nitin Singh\n\nOutput formatting\n- For tabular results: return only a single JSON string with shape { type: 'table', title, columns, rows }. Do not wrap in markdown.\n- For narrative summaries: reply in clean Markdown, not a wall of text. Start with a short bold heading, then bullet points.\n  - Use bold for column names (e.g., **low_pressure_fault**), do not wrap column names in backticks.\n  - Prefer short, scannable bullets over long paragraphs.\n  - Avoid asterisks around names other than Markdown bold."
        }
      },
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 2.2,
      "position": [
        -240,
        -64
      ],
      "id": "6f2dc85b-5121-444e-8e82-f6b7d42c10fb",
      "name": "AI Agent"
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
      "typeVersion": 1,
      "position": [
        -384,
        176
      ],
      "id": "068183a3-dfd0-4df0-b1d6-2fc549e184df",
      "name": "Google Gemini Chat Model",
      "credentials": {
        "googlePalmApi": {
          "id": "lO8uQfep9oWzitOf",
          "name": "Google Gemini(PaLM) Api account"
        }
      }
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "{{ $fromAI('sql_query') }}",
        "options": {}
      },
      "type": "n8n-nodes-base.mySqlTool",
      "typeVersion": 2.5,
      "position": [
        416,
        96
      ],
      "id": "2511084a-4a12-4c10-bf94-01339f1bda5e",
      "name": "Execute a SQL query in MySQL1",
      "credentials": {
        "mySql": {
          "id": "g6mvU23hG4KtWvE7",
          "name": "MySQL account"
        }
      }
    },
    {
      "parameters": {
        "sessionIdType": "customKey",
        "sessionKey": "=webhook_{{ $json.session_id || $json.user_id || $json.headers['x-session-id'] || 'default' }}",
        "contextWindowLength": 8
      },
      "type": "@n8n/n8n-nodes-langchain.memoryPostgresChat",
      "typeVersion": 1.3,
      "position": [
        -240,
        160
      ],
      "id": "4714fb8a-1d67-451e-8fbe-bad6d69bfa15",
      "name": "Postgres Chat Memory1",
      "credentials": {
        "postgres": {
          "id": "KongdbPAxlJJafS9",
          "name": "Postgres account"
        }
      }
    },
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "lovable-webhook",
        "responseMode": "responseNode",
        "options": {}
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2.1,
      "position": [
        -480,
        -32
      ],
      "id": "e86f444a-4962-4028-8a9e-3c1678187d78",
      "name": "Webhook1",
      "webhookId": "753156d7-aa10-4914-8a8f-8ddf9fd147d8"
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ { message: ($json.message && typeof $json.message === 'string' && $json.message.length > 0) ? $json.message : ($json.output ? (typeof $json.output === 'string' ? $json.output : JSON.stringify($json.output)) : 'No response found.') } }}",
        "options": {}
      },
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.4,
      "position": [
        160,
        -64
      ],
      "id": "0db36a7c-f5d2-4bfc-9da5-653478ea140f",
      "name": "Respond to Webhook1"
    },
    {
      "parameters": {
        "functionCode": "function buildColumnsFromRows(rows) {\n  const colSet = new Set();\n  for (const r of rows) {\n    if (r && typeof r === 'object') {\n      Object.keys(r).forEach(k => colSet.add(k));\n    }\n  }\n  return Array.from(colSet);\n}\n\nfunction emptyResponseText(defaultText = 'No results found.') {\n  return defaultText;\n}\n\n// Prefer grabbing output directly from AI Agent node input\nlet agentOutput;\ntry {\n  const agent = $item(0).$node['AI Agent'];\n  if (agent && agent.json && typeof agent.json.output === 'string') {\n    agentOutput = agent.json.output;\n  }\n} catch (e) {\n  // ignore if helper not available\n}\n\nconst current = (typeof $json !== 'undefined' ? $json : (item && item.json ? item.json : {}));\nconst out = (agentOutput ?? current.message ?? current.output ?? (current.data && (current.data.message ?? current.data.output)));\nlet message;\n\nif (typeof out === 'string') {\n  try {\n    const parsed = JSON.parse(out);\n    if (parsed && parsed.type === 'table' && Array.isArray(parsed.columns) && Array.isArray(parsed.rows)) {\n      if (!parsed.rows.length) {\n        message = emptyResponseText();\n      } else {\n        message = JSON.stringify(parsed);\n      }\n    } else if (Array.isArray(parsed)) {\n      if (!parsed.length) {\n        message = emptyResponseText();\n      } else if (typeof parsed[0] === 'object') {\n        const columns = buildColumnsFromRows(parsed);\n        message = JSON.stringify({ type: 'table', title: 'Query Results', columns, rows: parsed });\n      } else {\n        message = out;\n      }\n    } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.data)) {\n      if (!parsed.data.length) {\n        message = emptyResponseText();\n      } else {\n        const columns2 = buildColumnsFromRows(parsed.data);\n        message = JSON.stringify({ type: 'table', title: parsed.title || 'Query Results', columns: columns2, rows: parsed.data });\n      }\n    } else {\n      message = out;\n    }\n  } catch (e) {\n    message = out;\n  }\n} else if (Array.isArray(out)) {\n  if (!out.length) {\n    message = emptyResponseText();\n  } else {\n    const columns = buildColumnsFromRows(out);\n    message = JSON.stringify({ type: 'table', title: 'Query Results', columns, rows: out });\n  }\n} else if (out && typeof out === 'object') {\n  const columns = Array.isArray(out.columns) ? out.columns : undefined;\n  const rows = Array.isArray(out.rows) ? out.rows : undefined;\n  if (columns && rows) {\n    if (!rows.length) {\n      message = emptyResponseText();\n    } else {\n      message = JSON.stringify({ type: 'table', title: out.title || 'Query Results', columns, rows });\n    }\n  } else if (Array.isArray(out.data)) {\n    if (!out.data.length) {\n      message = emptyResponseText();\n    } else {\n      const columns2 = buildColumnsFromRows(out.data);\n      message = JSON.stringify({ type: 'table', title: out.title || 'Query Results', columns: columns2, rows: out.data });\n    }\n  } else if (out && typeof out === 'object' && Object.keys(out).length === 0) {\n    message = emptyResponseText();\n  } else if (out !== undefined) {\n    message = JSON.stringify(out);\n  } else {\n    message = emptyResponseText();\n  }\n}\n\nconst finalMessage = (typeof message === 'string' && message.length > 0) ? message : (typeof agentOutput === 'string' && agentOutput.length > 0 ? agentOutput : emptyResponseText());\nreturn { message: finalMessage };"
      },
      "type": "n8n-nodes-base.functionItem",
      "typeVersion": 1,
      "position": [
        -16,
        -64
      ],
      "id": "6a7b5f0e-07e5-4b2d-a4ae-1a8d8a0a8c21",
      "name": "Normalize Output"
    },
    {
      "parameters": {
        "workflowId": {
          "__rl": true,
          "value": "HUziFnRpn30BnyQK",
          "mode": "list",
          "cachedResultName": "My Sub-Workflow 2"
        },
        "workflowInputs": {
          "mappingMode": "defineBelow",
          "value": {
            "aNumber": 0
          },
          "matchingColumns": [],
          "schema": [
            {
              "id": "aField",
              "displayName": "aField",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "aNumber",
              "displayName": "aNumber",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "number",
              "removed": false
            },
            {
              "id": "thisFieldAcceptsAnyType",
              "displayName": "thisFieldAcceptsAnyType",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "anArray",
              "displayName": "anArray",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "array",
              "removed": false
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        }
      },
      "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
      "typeVersion": 2.2,
      "position": [
        -96,
        240
      ],
      "id": "089181a5-dad9-42f0-9914-bf4be052afe6",
      "name": "Get tables, schemas, columns, and foreign keys"
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "{{ $fromAI('sql_query') }}",
        "options": {}
      },
      "type": "n8n-nodes-base.postgresTool",
      "typeVersion": 2.6,
      "position": [
        48,
        192
      ],
      "id": "59dc105b-e3df-4f50-bab6-b3150245f708",
      "name": "Execute a SQL query in Postgres",
      "credentials": {
        "postgres": {
          "id": "KongdbPAxlJJafS9",
          "name": "Postgres account"
        }
      }
    }
  ],
  "pinData": {},
  "connections": {
    "Send a message in Gmail1": {
      "ai_tool": [
        [
          {
            "node": "AI Agent",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent": {
      "main": [
        [
          {
            "node": "Normalize Output",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Normalize Output": {
      "main": [
        [
          {
            "node": "Respond to Webhook1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Gemini Chat Model": {
      "ai_languageModel": [
        [
          {
            "node": "AI Agent",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "Execute a SQL query in MySQL1": {
      "ai_tool": [
        []
      ]
    },
    "Postgres Chat Memory1": {
      "ai_memory": [
        [
          {
            "node": "AI Agent",
            "type": "ai_memory",
            "index": 0
          }
        ]
      ]
    },
    "Webhook1": {
      "main": [
        [
          {
            "node": "AI Agent",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get tables, schemas, columns, and foreign keys": {
      "ai_tool": [
        [
          {
            "node": "AI Agent",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Execute a SQL query in Postgres": {
      "ai_tool": [
        [
          {
            "node": "AI Agent",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": true,
  "settings": {
    "executionOrder": "v1",
    "callerPolicy": "workflowsFromSameOwner"
  },
  "versionId": "d6bb1b67-1632-46fc-af1f-5a3960b73268",
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "1c98d6cd353773363be1fb94b8f89fb27ede8f5aabfd2ae0d5c1e031ae6a2c65"
  },
  "id": "TBUbOjApaRrIeepa",
  "tags": []
}
