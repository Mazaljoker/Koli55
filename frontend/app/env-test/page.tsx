"use client";

import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Typography, Divider } from "antd";

const { Title, Text, Paragraph } = Typography;

interface EnvTest {
  name: string;
  value: string | undefined;
  type: "client" | "server";
  status: "success" | "error" | "warning";
}

export default function EnvTestPage() {
  const [envTests, setEnvTests] = useState<EnvTest[]>([]);
  const [serverTime, setServerTime] = useState<string>("");

  useEffect(() => {
    // Tests côté client
    const clientTests: EnvTest[] = [
      {
        name: "NEXT_PUBLIC_SUPABASE_URL",
        value: process.env.NEXT_PUBLIC_SUPABASE_URL,
        type: "client",
        status: process.env.NEXT_PUBLIC_SUPABASE_URL ? "success" : "error",
      },
      {
        name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? `SET (${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length} chars)`
          : undefined,
        type: "client",
        status: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "success" : "error",
      },
      {
        name: "NEXT_PUBLIC_VAPI_PUBLIC_KEY",
        value: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY
          ? `SET (${process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY.length} chars)`
          : undefined,
        type: "client",
        status: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ? "success" : "warning",
      },
      {
        name: "NEXT_PUBLIC_APP_NAME",
        value: process.env.NEXT_PUBLIC_APP_NAME || "AlloKoli",
        type: "client",
        status: process.env.NEXT_PUBLIC_APP_NAME ? "success" : "warning",
      },
      {
        name: "NODE_ENV",
        value: process.env.NODE_ENV,
        type: "client",
        status: process.env.NODE_ENV ? "success" : "warning",
      },
    ];

    setEnvTests(clientTests);
    setServerTime(new Date().toISOString());

    // Log pour debug
    console.log("=== DEBUG VARIABLES ENVIRONNEMENT PAGE TEST ===");
    console.log(
      "Environnement:",
      typeof window !== "undefined" ? "CLIENT" : "SERVER"
    );
    console.log("Toutes les clés process.env:", Object.keys(process.env));
    console.log(
      "Variables NEXT_PUBLIC_*:",
      Object.keys(process.env).filter((key) => key.startsWith("NEXT_PUBLIC_"))
    );
    console.log(
      "NEXT_PUBLIC_SUPABASE_URL:",
      process.env.NEXT_PUBLIC_SUPABASE_URL
    );
    console.log(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY:",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "NOT SET"
    );
    console.log("=== FIN DEBUG ===");
  }, []);

  const columns = [
    {
      title: "Variable",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: "Valeur",
      dataIndex: "value",
      key: "value",
      render: (text: string | undefined) => (
        <Text type={text ? "success" : "danger"}>{text || "NON DÉFINIE"}</Text>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag color={type === "client" ? "blue" : "green"}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors = {
          success: "green",
          warning: "orange",
          error: "red",
        };
        const labels = {
          success: "OK",
          warning: "OPTIONNEL",
          error: "MANQUANT",
        };
        return (
          <Tag color={colors[status as keyof typeof colors]}>
            {labels[status as keyof typeof labels]}
          </Tag>
        );
      },
    },
  ];

  const successCount = envTests.filter(
    (test) => test.status === "success"
  ).length;
  const totalCount = envTests.length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <Title level={2}>🧪 Test des Variables d'Environnement</Title>

          <Paragraph>
            Cette page teste l'accès aux variables d'environnement côté client
            et serveur. Ouvrez la console du navigateur (F12) pour voir les logs
            de debug.
          </Paragraph>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card size="small">
              <Text type="secondary">Variables testées</Text>
              <div className="text-2xl font-bold">{totalCount}</div>
            </Card>
            <Card size="small">
              <Text type="success">Variables OK</Text>
              <div className="text-2xl font-bold text-green-600">
                {successCount}
              </div>
            </Card>
            <Card size="small">
              <Text type="secondary">Heure du test</Text>
              <div className="text-sm">{serverTime}</div>
            </Card>
          </div>

          <Divider />

          <Title level={3}>Résultats des tests</Title>

          <Table
            dataSource={envTests}
            columns={columns}
            rowKey="name"
            pagination={false}
            size="small"
          />

          <Divider />

          <div className="bg-blue-50 p-4 rounded">
            <Title level={4}>💡 Instructions de résolution</Title>
            <ol>
              <li>
                Vérifiez que les fichiers <Text code>.env.local</Text> existent
                dans <Text code>/frontend/</Text>
              </li>
              <li>
                Redémarrez le serveur Next.js :{" "}
                <Text code>cd frontend && pnpm dev</Text>
              </li>
              <li>
                Les variables <Text code>NEXT_PUBLIC_*</Text> doivent être
                visibles côté client
              </li>
              <li>
                Ouvrez la console du navigateur pour voir les logs détaillés
              </li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
}
