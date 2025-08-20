'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PodcastScript, PodcastScene } from '@/types/podcast';

interface ScriptDisplayProps {
  script: PodcastScript;
  onEdit: (editedScript: PodcastScript) => void;
  editable: boolean;
}

export function ScriptDisplay({ script, onEdit, editable }: ScriptDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedScript, setEditedScript] = useState<PodcastScript>(script);

  const handleSave = () => {
    onEdit(editedScript);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedScript(script);
    setIsEditing(false);
  };

  const updateScene = (sceneIndex: number, updates: Partial<PodcastScene>) => {
    const updatedScenes = editedScript.scenes.map((scene, index) => 
      index === sceneIndex ? { ...scene, ...updates } : scene
    );
    setEditedScript({ ...editedScript, scenes: updatedScenes });
  };

  const displayScript = isEditing ? editedScript : script;

  return (
    <div className="space-y-6">
      {/* Script Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="text-2xl">
                {isEditing ? (
                  <Input
                    value={editedScript.title}
                    onChange={(e) => setEditedScript({ ...editedScript, title: e.target.value })}
                    className="text-2xl font-bold"
                  />
                ) : (
                  displayScript.title
                )}
              </CardTitle>
              <CardDescription>
                {isEditing ? (
                  <Textarea
                    value={editedScript.overview}
                    onChange={(e) => setEditedScript({ ...editedScript, overview: e.target.value })}
                    rows={2}
                  />
                ) : (
                  displayScript.overview
                )}
              </CardDescription>
            </div>
            
            {editable && (
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel} size="sm">
                      Cancel
                    </Button>
                    <Button onClick={handleSave} size="sm">
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(true)} size="sm">
                    Edit Script
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">Topic: {displayScript.topic}</Badge>
            <Badge variant="outline">{displayScript.scenes.length} Scenes</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Scenes */}
      <div className="space-y-4">
        {displayScript.scenes.map((scene, index) => (
          <Card key={scene.id} className="relative">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {scene.id}
                  </div>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {isEditing ? (
                      <Input
                        value={scene.title}
                        onChange={(e) => updateScene(index, { title: e.target.value })}
                        className="font-semibold"
                      />
                    ) : (
                      scene.title
                    )}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Scene Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Scene Setting</h4>
                {isEditing ? (
                  <Textarea
                    value={scene.sceneDescription}
                    onChange={(e) => updateScene(index, { sceneDescription: e.target.value })}
                    rows={2}
                  />
                ) : (
                  <p className="text-sm">{scene.sceneDescription}</p>
                )}
              </div>

              {/* Dialogue */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Dialogue</h4>
                {isEditing ? (
                  <Textarea
                    value={scene.dialogue}
                    onChange={(e) => updateScene(index, { dialogue: e.target.value })}
                    rows={4}
                  />
                ) : (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="italic">{scene.dialogue}</p>
                  </div>
                )}
              </div>

              {/* Visual Direction */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Visual Direction</h4>
                {isEditing ? (
                  <Textarea
                    value={scene.visualDirection}
                    onChange={(e) => updateScene(index, { visualDirection: e.target.value })}
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{scene.visualDirection}</p>
                )}
              </div>

              {/* Transition Note */}
              {scene.transitionNote && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Transition</h4>
                  {isEditing ? (
                    <Textarea
                      value={scene.transitionNote}
                      onChange={(e) => updateScene(index, { transitionNote: e.target.value })}
                      rows={2}
                    />
                  ) : (
                    <p className="text-sm text-blue-600">{scene.transitionNote}</p>
                  )}
                </div>
              )}
            </CardContent>

            {/* Scene Separator */}
            {index < displayScript.scenes.length - 1 && (
              <div className="px-6 pb-4">
                <Separator />
                <div className="text-center mt-2">
                  <Badge variant="outline" className="text-xs">
                    Transition to Scene {displayScript.scenes[index + 1].id}
                  </Badge>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Script Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center space-x-8 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{displayScript.scenes.length}</div>
              <div className="text-sm text-muted-foreground">Total Scenes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                ~{Math.round(displayScript.scenes.length * 0.75)} min
              </div>
              <div className="text-sm text-muted-foreground">Estimated Duration</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {displayScript.scenes.reduce((total, scene) => 
                  total + scene.dialogue.split(' ').length, 0
                )}
              </div>
              <div className="text-sm text-muted-foreground">Total Words</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}