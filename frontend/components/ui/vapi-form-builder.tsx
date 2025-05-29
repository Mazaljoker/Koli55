'use client';

import React, { useEffect } from 'react';
import { Form, Input, Select, Switch, InputNumber, Space, Card } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button } from "@/components/ui/Button";

const { Option } = Select;

// Type pour définir un schéma JSON
interface JsonSchema {
  type: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  enum?: string[];
  description?: string;
  format?: string;
  default?: unknown;
}

// Types pour les propriétés du composant
interface VapiFormBuilderProps {
  schema: JsonSchema; // Le schéma JSON à utiliser pour construire le formulaire
  initialValues?: Record<string, unknown>; // Valeurs initiales du formulaire
  onSubmit: (values: Record<string, unknown>) => void; // Fonction appelée lors de la soumission
  loading?: boolean; // État de chargement du formulaire
  submitButtonText?: string; // Texte du bouton de soumission
}

// Composant principal pour construire un formulaire basé sur un schéma Vapi
const VapiFormBuilder: React.FC<VapiFormBuilderProps> = ({
  schema,
  initialValues = {},
  onSubmit,
  loading = false,
  submitButtonText = 'Enregistrer'
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    // Réinitialiser le formulaire quand les valeurs initiales changent
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  // Soumission du formulaire
  const handleSubmit = (values: Record<string, unknown>) => {
    onSubmit(values);
  };

  // Fonction récursive pour générer les champs du formulaire
  const renderFormItem = (
    key: string,
    schema: JsonSchema,
    path: string = key,
    required: boolean = false
  ) => {
    const fieldPath = path.split('.');
    const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    if (!schema) return null;

    // Déterminer le type de champ basé sur le schéma
    if (schema.type === 'object' && schema.properties) {
      return (
        <Card 
          key={path} 
          title={label} 
          className="mb-4" 
          size="small" 
          style={{ marginBottom: '16px' }}
        >
          {Object.keys(schema.properties).map(propKey => 
            renderFormItem(
              propKey, 
              schema.properties![propKey], 
              `${path}.${propKey}`,
              schema.required?.includes(propKey) || false
            )
          )}
        </Card>
      );
    } else if (schema.type === 'array' && schema.items) {
      return (
        <Form.List key={path} name={fieldPath}>
          {(fields, { add, remove }) => (
            <Card 
              title={label} 
              className="mb-4" 
              size="small" 
              style={{ marginBottom: '16px' }}
              extra={
                <Button 
                  variant="primary" 
                  size="small" 
                  icon={<PlusOutlined />} 
                  onClick={() => add()}
                >
                  Ajouter
                </Button>
              }
            >
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ position: 'relative', marginBottom: '16px' }}>
                  {schema.items?.type === 'object' && schema.items.properties ? (
                    <Card 
                      size="small" 
                      style={{ marginBottom: '8px' }}
                      extra={
                        <MinusCircleOutlined 
                          onClick={() => remove(name)} 
                          style={{ color: '#ff4d4f' }} 
                        />
                      }
                    >
                      {Object.keys(schema.items.properties).map(propKey => {
                        const itemSchema = schema.items!.properties![propKey];
                        const itemRequired = schema.items!.required?.includes(propKey) || false;
                        
                        return (
                          <Form.Item
                            key={`${path}.${name}.${propKey}`}
                            name={[name, propKey]}
                            label={propKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            rules={itemRequired ? [{ required: true, message: `Ce champ est requis` }] : []}
                          >
                            {renderInputForType(itemSchema)}
                          </Form.Item>
                        );
                      })}
                    </Card>
                  ) : (
                    <Form.Item
                      {...restField}
                      name={name}
                      style={{ width: '95%' }}
                    >
                      <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        {renderInputForType(schema.items!)}
                        <MinusCircleOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f' }} />
                      </Space>
                    </Form.Item>
                  )}
                </div>
              ))}
            </Card>
          )}
        </Form.List>
      );
    } else {
      return (
        <Form.Item
          key={path}
          name={fieldPath}
          label={label}
          rules={required ? [{ required: true, message: `${label} est requis` }] : []}
        >
          {renderInputForType(schema)}
        </Form.Item>
      );
    }
  };

  // Fonction pour générer le type d'input approprié
  const renderInputForType = (schema: JsonSchema) => {
    if (!schema) return <Input />;

    switch (schema.type) {
      case 'string':
        if (schema.enum) {
          return (
            <Select>
              {schema.enum.map((option: string) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          );
        }
        return <Input />;
        
      case 'number':
      case 'integer':
        return <InputNumber style={{ width: '100%' }} />;
        
      case 'boolean':
        return <Switch />;
        
      default:
        return <Input />;
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
      scrollToFirstError
    >
      {schema && schema.properties && Object.keys(schema.properties).map(key => 
        renderFormItem(
          key, 
          schema.properties![key], 
          key, 
          schema.required?.includes(key) || false
        )
      )}
      
      <Form.Item>
        <Button 
          variant="primary" 
          htmlType="submit" 
          isLoading={loading} 
          style={{ marginTop: '16px' }}
        >
          {submitButtonText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default VapiFormBuilder; 