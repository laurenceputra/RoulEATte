(function(){dust.register("app/app",body_0);var blocks={"body":body_1};function body_0(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.partial("layouts/master",ctx,null);}function body_1(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.exists(ctx.getPath(false, ["session","user_id"]),ctx,{"else":body_2,"block":body_3},null).write("<div id=\"app\" class=\"pure-g\"><div class=\"pure-u-1 pure-u-md-1-3\"></div><div id=\"main\" class=\"pure-u-1 pure-u-md-1-3\"><div id=\"listSelectContainer\" class=\"hide\"></div><div id=\"loadingContainer\" style=\"width:100px\"><img src=\"/img/loading.gif\"></div><div id=\"suggestedLocationContainer\" class=\"hide\"></div><div id=\"buttonsContainer\" class=\"show\"></div></div><div class=\"pure-u-1 pure-u-md-1-3\"></div></div><script type=\"text/javascript\" src=\"/js/app.js\"></script>");}function body_2(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.write("<script type=\"text/javascript\">var loggedIn = false;</script>");}function body_3(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.write("<script type=\"text/javascript\">var loggedIn = true;</script>");}return body_0;})();