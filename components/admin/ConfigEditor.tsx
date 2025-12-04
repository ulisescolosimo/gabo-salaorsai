import React, { useState, useEffect } from 'react';
import { db } from '../../services/supabaseDatabase';
import { Button } from '../ui/Button';
import { RichTextEditor } from '../ui/RichTextEditor';
import { useToast } from '../../hooks/useToast';
import { FileText, Eye, Edit3, Save, X } from 'lucide-react';

export const ConfigEditor: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [headerText, setHeaderText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const config = await db.getConfig('public_form_header');
      if (config) {
        setHeaderText(config.value);
        setOriginalText(config.value);
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Error al cargar la configuración.',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await db.updateConfig('public_form_header', headerText);
      toast({
        title: 'Guardado',
        description: 'El texto del formulario se actualizó correctamente.',
        variant: 'success',
      });
      setIsEditing(false);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Error al guardar la configuración.',
        variant: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setHeaderText(originalText); // Restore original text
    setIsEditing(false);
    setPreview(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Texto del Formulario Público
            </h2>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit3 size={16} className="mr-2" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => setPreview(!preview)}
                variant="outline"
                size="sm"
              >
                <Eye size={16} className="mr-2" />
                {preview ? 'Editar' : 'Vista Previa'}
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X size={16} className="mr-2" />
                Cancelar
              </Button>
              <Button 
                onClick={handleSave} 
                isLoading={saving}
                size="sm"
              >
                <Save size={16} className="mr-2" />
                Guardar
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {isEditing && !preview ? (
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Usa la barra de herramientas para dar formato al texto. El editor es <strong>WYSIWYG</strong> (What You See Is What You Get).
              </p>
            </div>
            <RichTextEditor
              content={headerText}
              onChange={setHeaderText}
              placeholder="Escribe el texto del encabezado aquí..."
            />
          </div>
        ) : (
          <div className="prose prose-orange max-w-none">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                Vista Previa
              </h3>
              <div 
                className="prose prose-sm sm:prose lg:prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: headerText }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

