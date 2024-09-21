const router = require("express").Router();
const volcanoService = require("../services/volcanoService");
const { isAuth } = require("../middlewares/authMiddleware");
const { getErrorMessage } = require("../utils/errorHelpers");

router.get("/catalog", async (req, res) => {
  const volcanoes = await volcanoService.getAll();

  res.render("volcanoes/catalog", { volcanoes });
});

router.get("/create", isAuth, (req, res) => {
  res.render("volcanoes/create");
});

router.post("/create", isAuth, async (req, res) => {
  const volcanoData = req.body;
  const owner = req.user._id;

  try {
    await volcanoService.createVolcano({ ...volcanoData, owner });

    res.redirect("/volcanoes/catalog");
  } catch (err) {
    res.render("volcanoes/create", {
      error: getErrorMessage(err),
      volcanoData,
    });
  }
});

router.get("/:volcanoId/details", async (req, res) => {
  const volcanoId = req.params.volcanoId;
  const volcano = await volcanoService.getOne(volcanoId).lean();
  const isOwner = req.user?._id == volcano.owner._id;

  const hasAlreadyVoted = volcano.voteList.toString().includes(req.user?._id);

  res.render("volcanoes/details", { volcano, isOwner, hasAlreadyVoted });
});

async function checkIfIsOwner(req, res, next) {
  let volcano = await volcanoService.getOne(req.params.volcanoId);

  if (volcano.owner._id == req.user._id) {
    next();
  } else {
    res.redirect(`/volcanoes/${req.params.volcanoId}/details`);
  }
}

router.get("/:volcanoId/delete", checkIfIsOwner, async (req, res) => {
  const volcanoId = req.params.volcanoId;

  try {
    await volcanoService.deleteVolcano(volcanoId);

    res.redirect("/volcanoes/catalog");
  } catch (err) {
    res.redirect(`/volcanoes/${volcanoId}/details`);
  }
});

router.get("/:volcanoId/edit", checkIfIsOwner, async (req, res) => {
  const volcano = await volcanoService.getOne(req.params.volcanoId).lean();

  res.render(`volcanoes/edit`, { volcano });
});

router.post("/:volcanoId/edit", checkIfIsOwner, async (req, res) => {
  const updateData = req.body;
  const volcanoId = req.params.volcanoId;

  const volcano = await volcanoService.getOne(volcanoId).lean();

  try {
    await volcanoService.updateVolcano(volcano, updateData);

    res.redirect(`/volcanoes/${volcanoId}/details`);
  } catch (err) {
    res.render(`volcanoes/edit`, { volcano, error: getErrorMessage(err) });
  }
});

router.get("/:volcanoId/vote", isAuth, async (req, res) => {
  const volcanoId = req.params.volcanoId;
  const volcano = await volcanoService.getOne(volcanoId).lean();
  const user = req.user?._id;
  const isOwner = req.user?._id == volcano.owner._id;

  if (!isOwner) {
    await volcanoService.vote(volcanoId, user);
    
    res.redirect(`/volcanoes/${volcanoId}/details`);
  } else {
    res.redirect(`/volcanoes/${volcanoId}/details`);
  }
});

router.get("/search", async (req, res) => {
  const volcanoes = await volcanoService.getAll();

  res.render("volcanoes/search", { volcanoes });
});

router.post("/search", async (req, res) => {
  const { name, type } = req.body;

  const volcanoes = await volcanoService.getSearchResult(name, type);

  res.render("volcanoes/search", { volcanoes });
});

module.exports = router;
