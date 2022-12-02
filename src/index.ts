import joplin from 'api';
import { MenuItemLocation } from 'api/types';

joplin.plugins.register({
    onStart: async function () {
        await joplin.commands.register({
            name: 'deleteNotesWithoutConfirmation',
            label: 'Force delete notes',
            execute: async (noteIds: string[]) => {
                // If this command is triggered from menu <Tools> then noteIds will be null
                // So we need to get all selected note ids in current workspace as below
                if (!noteIds) {
                    noteIds = await joplin.workspace.selectedNoteIds();
                }

                noteIds.forEach(async (noteId: string) => {
                    await joplin.data.delete(['notes', noteId]);
                });
            },
        });

        await joplin.commands.register({
            name: 'deleteNotesAndAssociatedAttachmentsWithoutConfirmation',
            label: 'Force delete notes and all associated attachments',
            execute: async (noteIds: string[]) => {
                // If this command is triggered from menu <Tools> then noteIds will be null
                // So we need to get all selected note ids in current workspace as below
                if (!noteIds) {
                    noteIds = await joplin.workspace.selectedNoteIds();
                }

                noteIds.forEach(async (noteId: string) => {
                    const noteResources = await joplin.data.get([
                        'notes',
                        noteId,
                        'resources',
                    ]);
                    noteResources.items.forEach(async (noteRes) => {
                        await joplin.data.delete(['resources', noteRes.id]);
                    });

                    await joplin.data.delete(['notes', noteId]);
                });
            },
        });

        await joplin.views.menuItems.create(
            'ToolsDeleteNotes',
            'deleteNotesWithoutConfirmation',
            MenuItemLocation.Tools,
            { accelerator: 'CmdOrCtrl+Alt+Shift+D' }
        );

        await joplin.views.menuItems.create(
            'noteListMenuItemDeleteNotes',
            'deleteNotesWithoutConfirmation',
            MenuItemLocation.NoteListContextMenu,
            { accelerator: 'CmdOrCtrl+Alt+Shift+D' }
        );

        await joplin.views.menuItems.create(
            'ToolsDeleteNotesAndAssociatedAttachments',
            'deleteNotesAndAssociatedAttachmentsWithoutConfirmation',
            MenuItemLocation.Tools,
            { accelerator: 'CmdOrCtrl+Alt+D' }
        );

        await joplin.views.menuItems.create(
            'noteListMenuItemDeleteNotesAndAssociatedAttachments',
            'deleteNotesAndAssociatedAttachmentsWithoutConfirmation',
            MenuItemLocation.NoteListContextMenu,
            { accelerator: 'CmdOrCtrl+Alt+D' }
        );
    },
});
