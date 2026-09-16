// Joplin SDK public API (generated).

#ifndef JOPLIN_API_H
#define JOPLIN_API_H

#include "sdk.h"

// Folder entity.
Entity* folder_entity_new(JoplinSDK* client, voxgig_value* entopts);
Entity* joplin_folder(JoplinSDK* client, voxgig_value* entopts);
voxgig_value* folder_stream(Entity* e, const char* action, voxgig_value* args, voxgig_value* callopts, PNError** err);
// Note entity.
Entity* note_entity_new(JoplinSDK* client, voxgig_value* entopts);
Entity* joplin_note(JoplinSDK* client, voxgig_value* entopts);
voxgig_value* note_stream(Entity* e, const char* action, voxgig_value* args, voxgig_value* callopts, PNError** err);
// Tag entity.
Entity* tag_entity_new(JoplinSDK* client, voxgig_value* entopts);
Entity* joplin_tag(JoplinSDK* client, voxgig_value* entopts);
voxgig_value* tag_stream(Entity* e, const char* action, voxgig_value* args, voxgig_value* callopts, PNError** err);

#endif // JOPLIN_API_H
