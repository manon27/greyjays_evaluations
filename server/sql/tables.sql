-- --------------------------------------------------------

--
-- Base de données :  `gj_evaluation`
--

-- --------------------------------------------------------

--
-- Structure de la table `gj_action`
--

CREATE TABLE `gj_action` (
  `id` int(11) NOT NULL,
  `libelle` varchar(250) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `mesurable` tinyint(1) NOT NULL DEFAULT '0',
  `id_position` int(11) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déclencheurs `gj_action`
--
DELIMITER $$
CREATE TRIGGER `action_delete_cascade` AFTER DELETE ON `gj_action` FOR EACH ROW BEGIN
DELETE FROM gj_performance WHERE gj_performance.id_action=old.id;
DELETE FROM gj_resultat WHERE gj_resultat.id_action=old.id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `gj_joueur`
--

CREATE TABLE `gj_joueur` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `date_naissance` timestamp NULL DEFAULT NULL,
  `taille` int(11) DEFAULT NULL,
  `poids` int(11) DEFAULT NULL,
  `date_inscription` timestamp NULL DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déclencheurs `gj_joueur`
--
DELIMITER $$
CREATE TRIGGER `joueur_delete_cascade` AFTER DELETE ON `gj_joueur` FOR EACH ROW DELETE FROM gj_resultat WHERE gj_resultat.id_joueur=old.id
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `gj_performance`
--

CREATE TABLE `gj_performance` (
  `id` int(11) NOT NULL,
  `libelle` varchar(250) NOT NULL,
  `note` int(11) NOT NULL,
  `id_action` int(11) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `gj_position`
--

CREATE TABLE `gj_position` (
  `id` int(11) NOT NULL,
  `libelle` varchar(250) NOT NULL,
  `description` varchar(250) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déclencheurs `gj_position`
--
DELIMITER $$
CREATE TRIGGER `position_delete_cascade` AFTER DELETE ON `gj_position` FOR EACH ROW DELETE FROM gj_action WHERE gj_action.id_position=old.id
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `gj_resultat`
--

CREATE TABLE `gj_resultat` (
  `id` int(11) NOT NULL,
  `id_joueur` int(11) NOT NULL,
  `id_action` int(11) NOT NULL,
  `performance` int(11) NOT NULL,
  `inmatch` tinyint(1) NOT NULL DEFAULT '0',
  `date_creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` timestamp NOT NULL,
  `date_realisation` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `gj_action`
--
ALTER TABLE `gj_action`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `gj_joueur`
--
ALTER TABLE `gj_joueur`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `gj_performance`
--
ALTER TABLE `gj_performance`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `gj_position`
--
ALTER TABLE `gj_position`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `gj_resultat`
--
ALTER TABLE `gj_resultat`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `resultatkey` (`id_joueur`,`id_action`,`date_realisation`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `gj_action`
--
ALTER TABLE `gj_action`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
--
-- AUTO_INCREMENT pour la table `gj_joueur`
--
ALTER TABLE `gj_joueur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
--
-- AUTO_INCREMENT pour la table `gj_performance`
--
ALTER TABLE `gj_performance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
--
-- AUTO_INCREMENT pour la table `gj_position`
--
ALTER TABLE `gj_position`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
--
-- AUTO_INCREMENT pour la table `gj_resultat`
--
ALTER TABLE `gj_resultat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

