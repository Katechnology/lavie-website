#!/bin/zsh
# usage: art/gen.sh <prompt.md> <out.png> [size] [ref images...]
P="$1"; OUT="$2"; SIZE="${3:-2048x1152}"; shift 3 2>/dev/null
REFS=(); for r in "$@"; do REFS+=(--image "$r"); done
TMP=$(mktemp -t lavieprompt)
cat > "$TMP" <<EOP
Use your built-in image generation tool (gpt-image) exactly once to generate ONE image. Requested size: ${SIZE} at the highest quality available.$( (( ${#REFS} )) && echo " The attached image(s) are references: pass them to the image tool as reference input images." )
Use the following prompt verbatim as the image prompt; do not rewrite or shorten it.

----- PROMPT START -----
$(cat "$P")
----- PROMPT END -----

After it is generated, copy the resulting image file to this exact path: ${OUT} (convert to PNG if needed). Then print the final pixel dimensions with: sips -g pixelWidth -g pixelHeight '${OUT}'. Do nothing else.
EOP
codex exec --skip-git-repo-check -s danger-full-access "${REFS[@]}" - < "$TMP" 2>&1 | tail -8
rm -f "$TMP"
