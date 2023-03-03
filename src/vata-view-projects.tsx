import React from "react";
import { ActionPanel, List, Action, Form, useNavigation } from "@raycast/api";
import { useExtensionState } from "./hooks";

const ProjectCreationForm = ({
  createProject,
}: {
  createProject: (props: { name: string; description: string }) => void;
}) => {
  const { pop } = useNavigation();

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [nameTouched, setNameTouched] = React.useState(false);

  const nameError = nameTouched && !name ? "Name is required" : undefined;
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Create Project"
            onSubmit={() => {
              createProject({ name, description });

              pop();
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="name"
        title="Name"
        placeholder="Name"
        onChange={setName}
        onBlur={() => setNameTouched(true)}
        error={nameError}
      />
      <Form.TextField id="description" title="Description" placeholder="Description" onChange={setDescription} />
    </Form>
  );
};

export default () => {
  const { push } = useNavigation();
  const extensionState = useExtensionState();

  return (
    <List>
      {extensionState.projects.map((project) => {
        return (
          <List.Item
            title={project.name}
            key={project.id}
            actions={
              <ActionPanel>
                <Action
                  title="Set as main project"
                  shortcut={{ modifiers: ["cmd"], key: "m" }}
                  onAction={() => {
                    extensionState.setMainProject(project);
                  }}
                />
                <Action
                  title="Remove Project"
                  shortcut={{ modifiers: ["cmd"], key: "r" }}
                  onAction={() => {
                    extensionState.removeProject(project);
                  }}
                />
                <Action title="Edit Project" shortcut={{ modifiers: ["cmd"], key: "i" }} onAction={() => undefined} />
              </ActionPanel>
            }
          />
        );
      })}
      <List.Item
        title={"New Project"}
        actions={
          <ActionPanel>
            <Action
              title="New Project"
              onAction={() => {
                push(<ProjectCreationForm createProject={extensionState.createProject} />);
              }}
            />
          </ActionPanel>
        }
      ></List.Item>
    </List>
  );
};
