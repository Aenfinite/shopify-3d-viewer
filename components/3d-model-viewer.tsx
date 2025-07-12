"use client"

import { Suspense, useRef, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import * as THREE from "three"

interface ModelViewerProps {
  modelUrl: string
  customizations?: Record<string, any>
  layerControls?: Record<string, string[]>
  className?: string
}

// Enhanced 3D Model Component with ALL customization support
function CustomizableModel({
  modelType,
  customizations = {},
  layerControls = {},
}: {
  modelType: string
  customizations: Record<string, any>
  layerControls: Record<string, string[]>
}) {
  const meshRef = useRef<THREE.Group>(null)
  const [modelParts, setModelParts] = useState<Record<string, THREE.Mesh>>({})

  // Create model based on type with ALL components
  useEffect(() => {
    if (!meshRef.current) return

    // Clear existing children
    while (meshRef.current.children.length > 0) {
      meshRef.current.remove(meshRef.current.children[0])
    }

    const parts: Record<string, THREE.Mesh> = {}

    // Get the main color - prioritize fabricColor, then color, then default
    const mainColor = customizations.fabricColor || customizations.color || customizations.mainColor || "#FFFFFF"
    console.log("Using main color for 3D model:", mainColor)

    if (modelType === "sample-shirt") {
      // Main body - affected by fit style and color
      const bodyGeometry = new THREE.BoxGeometry(
        customizations.fitstyle === "slim" ? 1.8 : customizations.fitstyle === "tailored" ? 1.9 : 2.0,
        2.5,
        customizations.fitstyle === "slim" ? 0.25 : customizations.fitstyle === "tailored" ? 0.28 : 0.3,
      )
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: mainColor,
        roughness: customizations.fabrictype === "silk" ? 0.2 : customizations.fabrictype === "linen" ? 0.9 : 0.7,
        metalness: customizations.fabrictype === "silk" ? 0.3 : 0.1,
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.name = "shirt_body"
      parts["shirt_body"] = body
      meshRef.current.add(body)

      // COLLAR VARIATIONS - All different styles with color support
      const collarColor = customizations.collarColor || mainColor
      const collarMaterial = new THREE.MeshStandardMaterial({
        color: collarColor,
        roughness: 0.6,
      })

      // Spread Collar
      const spreadCollarGeometry = new THREE.BoxGeometry(2.2, 0.3, 0.1)
      const spreadCollar = new THREE.Mesh(spreadCollarGeometry, collarMaterial)
      spreadCollar.position.set(0, 1.4, 0.2)
      spreadCollar.name = "collar_spread"
      parts["collar_spread"] = spreadCollar
      meshRef.current.add(spreadCollar)

      // Button Down Collar - smaller and angled
      const buttonDownCollarGeometry = new THREE.BoxGeometry(2.0, 0.25, 0.08)
      const buttonDownCollar = new THREE.Mesh(buttonDownCollarGeometry, collarMaterial)
      buttonDownCollar.position.set(0, 1.4, 0.2)
      buttonDownCollar.rotation.z = 0.1
      buttonDownCollar.name = "collar_button_down"
      parts["collar_button_down"] = buttonDownCollar
      meshRef.current.add(buttonDownCollar)

      // Cutaway Collar - wider
      const cutawayCollarGeometry = new THREE.BoxGeometry(2.5, 0.35, 0.1)
      const cutawayCollar = new THREE.Mesh(cutawayCollarGeometry, collarMaterial)
      cutawayCollar.position.set(0, 1.4, 0.2)
      cutawayCollar.name = "collar_cutaway"
      parts["collar_cutaway"] = cutawayCollar
      meshRef.current.add(cutawayCollar)

      // Band Collar - no traditional collar
      const bandCollarGeometry = new THREE.BoxGeometry(2.1, 0.15, 0.05)
      const bandCollar = new THREE.Mesh(bandCollarGeometry, collarMaterial)
      bandCollar.position.set(0, 1.3, 0.18)
      bandCollar.name = "collar_band"
      parts["collar_band"] = bandCollar
      meshRef.current.add(bandCollar)

      // Wing Collar - formal style
      const wingCollarGeometry = new THREE.BoxGeometry(1.8, 0.4, 0.12)
      const wingCollar = new THREE.Mesh(wingCollarGeometry, collarMaterial)
      wingCollar.position.set(0, 1.45, 0.22)
      wingCollar.rotation.x = 0.2
      wingCollar.name = "collar_wing"
      parts["collar_wing"] = wingCollar
      meshRef.current.add(wingCollar)

      // CUFF VARIATIONS with color support
      const cuffColor = customizations.cuffColor || mainColor
      const cuffMaterial = new THREE.MeshStandardMaterial({
        color: cuffColor,
        roughness: 0.6,
      })

      // Barrel Cuffs - standard
      const barrelCuffGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.2, 8)
      const leftBarrelCuff = new THREE.Mesh(barrelCuffGeometry, cuffMaterial)
      leftBarrelCuff.position.set(-2.0, 0.5, 0)
      leftBarrelCuff.rotation.z = Math.PI / 2
      leftBarrelCuff.name = "cuff_barrel_left"
      parts["cuff_barrel_left"] = leftBarrelCuff
      meshRef.current.add(leftBarrelCuff)

      const rightBarrelCuff = new THREE.Mesh(barrelCuffGeometry, cuffMaterial)
      rightBarrelCuff.position.set(2.0, 0.5, 0)
      rightBarrelCuff.rotation.z = -Math.PI / 2
      rightBarrelCuff.name = "cuff_barrel_right"
      parts["cuff_barrel_right"] = rightBarrelCuff
      meshRef.current.add(rightBarrelCuff)

      // French Cuffs - larger and folded
      const frenchCuffGeometry = new THREE.CylinderGeometry(0.32, 0.32, 0.35, 8)
      const leftFrenchCuff = new THREE.Mesh(frenchCuffGeometry, cuffMaterial)
      leftFrenchCuff.position.set(-2.0, 0.5, 0)
      leftFrenchCuff.rotation.z = Math.PI / 2
      leftFrenchCuff.name = "cuff_french_left"
      parts["cuff_french_left"] = leftFrenchCuff
      meshRef.current.add(leftFrenchCuff)

      const rightFrenchCuff = new THREE.Mesh(frenchCuffGeometry, cuffMaterial)
      rightFrenchCuff.position.set(2.0, 0.5, 0)
      rightFrenchCuff.rotation.z = -Math.PI / 2
      rightFrenchCuff.name = "cuff_french_right"
      parts["cuff_french_right"] = rightFrenchCuff
      meshRef.current.add(rightFrenchCuff)

      // Convertible Cuffs - medium size
      const convertibleCuffGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.25, 8)
      const leftConvertibleCuff = new THREE.Mesh(convertibleCuffGeometry, cuffMaterial)
      leftConvertibleCuff.position.set(-2.0, 0.5, 0)
      leftConvertibleCuff.rotation.z = Math.PI / 2
      leftConvertibleCuff.name = "cuff_convertible_left"
      parts["cuff_convertible_left"] = leftConvertibleCuff
      meshRef.current.add(leftConvertibleCuff)

      const rightConvertibleCuff = new THREE.Mesh(convertibleCuffGeometry, cuffMaterial)
      rightConvertibleCuff.position.set(2.0, 0.5, 0)
      rightConvertibleCuff.rotation.z = -Math.PI / 2
      rightConvertibleCuff.name = "cuff_convertible_right"
      parts["cuff_convertible_right"] = rightConvertibleCuff
      meshRef.current.add(rightConvertibleCuff)

      // SLEEVES - affected by fit and color
      const sleeveColor = customizations.sleeveColor || mainColor
      const sleeveGeometry = new THREE.CylinderGeometry(
        customizations.fitstyle === "slim" ? 0.28 : 0.3,
        customizations.fitstyle === "slim" ? 0.23 : 0.25,
        1.5,
        8,
      )
      const sleeveMaterial = new THREE.MeshStandardMaterial({
        color: sleeveColor,
        roughness: 0.7,
      })

      const leftSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial)
      leftSleeve.position.set(
        customizations.fitstyle === "slim" ? -1.2 : customizations.fitstyle === "tailored" ? -1.25 : -1.3,
        0.5,
        0,
      )
      leftSleeve.rotation.z = Math.PI / 2
      parts["sleeve_left"] = leftSleeve
      meshRef.current.add(leftSleeve)

      const rightSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial)
      rightSleeve.position.set(
        customizations.fitstyle === "slim" ? 1.2 : customizations.fitstyle === "tailored" ? 1.25 : 1.3,
        0.5,
        0,
      )
      rightSleeve.rotation.z = -Math.PI / 2
      parts["sleeve_right"] = rightSleeve
      meshRef.current.add(rightSleeve)

      // POCKET VARIATIONS with color support
      const pocketColor = customizations.pocketColor || mainColor
      const pocketMaterial = new THREE.MeshStandardMaterial({
        color: pocketColor,
        roughness: 0.8,
      })

      // Standard Pocket
      const standardPocketGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.05)
      const standardPocket = new THREE.Mesh(standardPocketGeometry, pocketMaterial)
      standardPocket.position.set(-0.6, 0.3, 0.16)
      standardPocket.name = "pocket_standard"
      parts["pocket_standard"] = standardPocket
      meshRef.current.add(standardPocket)

      // Flap Pocket - with flap
      const flapPocketGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.05)
      const flapPocket = new THREE.Mesh(flapPocketGeometry, pocketMaterial)
      flapPocket.position.set(-0.6, 0.3, 0.16)
      flapPocket.name = "pocket_flap"
      parts["pocket_flap"] = flapPocket
      meshRef.current.add(flapPocket)

      const flapGeometry = new THREE.BoxGeometry(0.45, 0.15, 0.02)
      const flap = new THREE.Mesh(flapGeometry, pocketMaterial)
      flap.position.set(-0.6, 0.45, 0.18)
      flap.name = "pocket_flap_cover"
      parts["pocket_flap_cover"] = flap
      meshRef.current.add(flap)

      // Double Pocket
      const doublePocket1 = new THREE.Mesh(standardPocketGeometry, pocketMaterial)
      doublePocket1.position.set(-0.8, 0.3, 0.16)
      doublePocket1.name = "pocket_double_left"
      parts["pocket_double_left"] = doublePocket1
      meshRef.current.add(doublePocket1)

      const doublePocket2 = new THREE.Mesh(standardPocketGeometry, pocketMaterial)
      doublePocket2.position.set(-0.4, 0.3, 0.16)
      doublePocket2.name = "pocket_double_right"
      parts["pocket_double_right"] = doublePocket2
      meshRef.current.add(doublePocket2)

      // BUTTON VARIATIONS with color support
      const buttonColor = customizations.buttonColor || "#F5F5F5"
      const standardButtonMaterial = new THREE.MeshStandardMaterial({
        color: buttonColor,
        roughness: 0.3,
        metalness: 0.2,
      })

      const contrastButtonMaterial = new THREE.MeshStandardMaterial({
        color: customizations.buttonColor || "#2C2C2C",
        roughness: 0.2,
        metalness: 0.4,
      })

      const motherPearlButtonMaterial = new THREE.MeshStandardMaterial({
        color: customizations.buttonColor || "#FFF8DC",
        roughness: 0.1,
        metalness: 0.6,
      })

      // Standard Buttons
      const buttonGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.02, 8)
      for (let i = 0; i < 6; i++) {
        const button = new THREE.Mesh(buttonGeometry, standardButtonMaterial)
        button.position.set(0, 0.8 - i * 0.3, 0.16)
        button.name = `buttons_standard_${i}`
        parts[`buttons_standard_${i}`] = button
        meshRef.current.add(button)
      }

      // Contrast buttons
      for (let i = 0; i < 6; i++) {
        const contrastButton = new THREE.Mesh(buttonGeometry, contrastButtonMaterial)
        contrastButton.position.set(0, 0.8 - i * 0.3, 0.16)
        contrastButton.name = `buttons_contrast_${i}`
        parts[`buttons_contrast_${i}`] = contrastButton
        meshRef.current.add(contrastButton)
      }

      // Mother of pearl buttons
      for (let i = 0; i < 6; i++) {
        const motherPearlButton = new THREE.Mesh(buttonGeometry, motherPearlButtonMaterial)
        motherPearlButton.position.set(0, 0.8 - i * 0.3, 0.16)
        motherPearlButton.name = `buttons_mother_pearl_${i}`
        parts[`buttons_mother_pearl_${i}`] = motherPearlButton
        meshRef.current.add(motherPearlButton)
      }

      // Hidden placket - no visible buttons
      const hiddenPlacket = new THREE.BoxGeometry(0.3, 2.0, 0.02)
      const hiddenPlacketMesh = new THREE.Mesh(hiddenPlacket, standardButtonMaterial)
      hiddenPlacketMesh.position.set(0, 0.3, 0.155)
      hiddenPlacketMesh.name = "buttons_hidden"
      parts["buttons_hidden"] = hiddenPlacketMesh
      meshRef.current.add(hiddenPlacketMesh)

      // MONOGRAM OPTIONS
      const monogramMaterial = new THREE.MeshStandardMaterial({
        color: customizations.accentColor || "#8B4513",
        roughness: 0.8,
      })

      // Chest monogram
      const chestMonogramGeometry = new THREE.PlaneGeometry(0.2, 0.1)
      const chestMonogram = new THREE.Mesh(chestMonogramGeometry, monogramMaterial)
      chestMonogram.position.set(0.5, 0.5, 0.16)
      chestMonogram.name = "monogram_chest"
      parts["monogram_chest"] = chestMonogram
      meshRef.current.add(chestMonogram)

      // Cuff monogram
      const cuffMonogramGeometry = new THREE.PlaneGeometry(0.1, 0.05)
      const cuffMonogram = new THREE.Mesh(cuffMonogramGeometry, monogramMaterial)
      cuffMonogram.position.set(-1.8, 0.5, 0.1)
      cuffMonogram.name = "monogram_cuff"
      parts["monogram_cuff"] = cuffMonogram
      meshRef.current.add(cuffMonogram)

      // Collar monogram
      const collarMonogram = new THREE.Mesh(cuffMonogramGeometry, monogramMaterial)
      collarMonogram.position.set(0.8, 1.4, 0.22)
      collarMonogram.name = "monogram_collar"
      parts["monogram_collar"] = collarMonogram
      meshRef.current.add(collarMonogram)
    } else if (modelType === "sample-pants") {
      // PANTS WITH ALL CUSTOMIZATIONS AND COLORS
      const baseColor = mainColor

      // Waist - affected by waistband style
      const waistHeight =
        customizations.waistbandstyle === "extended" ? 0.3 : customizations.waistbandstyle === "comfort" ? 0.25 : 0.2
      const waistGeometry = new THREE.CylinderGeometry(0.8, 0.8, waistHeight, 16)
      const waistMaterial = new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: customizations.fabrictype === "linen-blend" ? 0.9 : 0.8,
      })
      const waist = new THREE.Mesh(waistGeometry, waistMaterial)
      waist.position.set(0, 1, 0)
      waist.name = "pants_waist"
      parts["pants_waist"] = waist
      meshRef.current.add(waist)

      // Legs - affected by fit style
      const legWidth =
        customizations.fitstyle === "slim"
          ? 0.3
          : customizations.fitstyle === "tapered"
            ? 0.35
            : customizations.fitstyle === "straight"
              ? 0.35
              : 0.4
      const legBottomWidth =
        customizations.fitstyle === "tapered" ? 0.25 : customizations.fitstyle === "slim" ? 0.28 : legWidth

      const legGeometry = new THREE.CylinderGeometry(legBottomWidth, legWidth, 2, 12)
      const legMaterial = new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.8,
      })

      const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
      leftLeg.position.set(-0.3, 0, 0)
      parts["leg_left"] = leftLeg
      meshRef.current.add(leftLeg)

      const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
      rightLeg.position.set(0.3, 0, 0)
      parts["leg_right"] = rightLeg
      meshRef.current.add(rightLeg)

      // POCKET VARIATIONS with color support
      const pocketColor = customizations.pocketColor || baseColor
      const pocketMaterial = new THREE.MeshStandardMaterial({
        color: pocketColor,
        roughness: 0.9,
      })

      // Standard pockets
      const standardPocketGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.05)
      const leftStandardPocket = new THREE.Mesh(standardPocketGeometry, pocketMaterial)
      leftStandardPocket.position.set(-0.5, 0.8, 0.4)
      leftStandardPocket.name = "pockets_standard_left"
      parts["pockets_standard_left"] = leftStandardPocket
      meshRef.current.add(leftStandardPocket)

      const rightStandardPocket = new THREE.Mesh(standardPocketGeometry, pocketMaterial)
      rightStandardPocket.position.set(0.5, 0.8, 0.4)
      rightStandardPocket.name = "pockets_standard_right"
      parts["pockets_standard_right"] = rightStandardPocket
      meshRef.current.add(rightStandardPocket)

      // Slanted pockets
      const slantedPocketGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.05)
      const leftSlantedPocket = new THREE.Mesh(slantedPocketGeometry, pocketMaterial)
      leftSlantedPocket.position.set(-0.5, 0.8, 0.4)
      leftSlantedPocket.rotation.z = 0.3
      leftSlantedPocket.name = "pockets_slanted_left"
      parts["pockets_slanted_left"] = leftSlantedPocket
      meshRef.current.add(leftSlantedPocket)

      const rightSlantedPocket = new THREE.Mesh(slantedPocketGeometry, pocketMaterial)
      rightSlantedPocket.position.set(0.5, 0.8, 0.4)
      rightSlantedPocket.rotation.z = -0.3
      rightSlantedPocket.name = "pockets_slanted_right"
      parts["pockets_slanted_right"] = rightSlantedPocket
      meshRef.current.add(rightSlantedPocket)

      // Cargo pockets
      const cargoPocketGeometry = new THREE.BoxGeometry(0.25, 0.35, 0.08)
      const leftCargoPocket = new THREE.Mesh(cargoPocketGeometry, pocketMaterial)
      leftCargoPocket.position.set(-0.6, 0.2, 0.35)
      leftCargoPocket.name = "pockets_cargo_left"
      parts["pockets_cargo_left"] = leftCargoPocket
      meshRef.current.add(leftCargoPocket)

      const rightCargoPocket = new THREE.Mesh(cargoPocketGeometry, pocketMaterial)
      rightCargoPocket.position.set(0.6, 0.2, 0.35)
      rightCargoPocket.name = "pockets_cargo_right"
      parts["pockets_cargo_right"] = rightCargoPocket
      meshRef.current.add(rightCargoPocket)

      // HEM VARIATIONS
      const hemColor = customizations.trimColor || baseColor
      const hemMaterial = new THREE.MeshStandardMaterial({
        color: hemColor,
        roughness: 0.7,
      })

      // Plain hem
      const plainHemGeometry = new THREE.CylinderGeometry(legBottomWidth + 0.02, legBottomWidth + 0.02, 0.05, 12)
      const leftPlainHem = new THREE.Mesh(plainHemGeometry, hemMaterial)
      leftPlainHem.position.set(-0.3, -1.0, 0)
      leftPlainHem.name = "hem_plain_left"
      parts["hem_plain_left"] = leftPlainHem
      meshRef.current.add(leftPlainHem)

      const rightPlainHem = new THREE.Mesh(plainHemGeometry, hemMaterial)
      rightPlainHem.position.set(0.3, -1.0, 0)
      rightPlainHem.name = "hem_plain_right"
      parts["hem_plain_right"] = rightPlainHem
      meshRef.current.add(rightPlainHem)

      // Cuffed hem
      const cuffedHemGeometry = new THREE.CylinderGeometry(legBottomWidth + 0.05, legBottomWidth + 0.05, 0.1, 12)
      const leftCuffedHem = new THREE.Mesh(cuffedHemGeometry, hemMaterial)
      leftCuffedHem.position.set(-0.3, -1.0, 0)
      leftCuffedHem.name = "hem_cuffed_left"
      parts["hem_cuffed_left"] = leftCuffedHem
      meshRef.current.add(leftCuffedHem)

      const rightCuffedHem = new THREE.Mesh(cuffedHemGeometry, hemMaterial)
      rightCuffedHem.position.set(0.3, -1.0, 0)
      rightCuffedHem.name = "hem_cuffed_right"
      parts["hem_cuffed_right"] = rightCuffedHem
      meshRef.current.add(rightCuffedHem)

      // BELT LOOPS with color support
      const beltLoopColor = customizations.accentColor || baseColor
      const beltLoopMaterial = new THREE.MeshStandardMaterial({
        color: beltLoopColor,
        roughness: 0.8,
      })

      const beltLoopGeometry = new THREE.BoxGeometry(0.05, 0.15, 0.03)
      for (let i = 0; i < 5; i++) {
        const angle = (i / 4) * Math.PI * 2
        const x = Math.cos(angle) * 0.75
        const z = Math.sin(angle) * 0.75

        const beltLoop = new THREE.Mesh(beltLoopGeometry, beltLoopMaterial)
        beltLoop.position.set(x, 1.1, z)
        beltLoop.name = `belt_loops_standard_${i}`
        parts[`belt_loops_standard_${i}`] = beltLoop
        meshRef.current.add(beltLoop)

        // Extended belt loops
        const extendedBeltLoopGeometry = new THREE.BoxGeometry(0.07, 0.2, 0.04)
        const extendedBeltLoop = new THREE.Mesh(extendedBeltLoopGeometry, beltLoopMaterial)
        extendedBeltLoop.position.set(x, 1.1, z)
        extendedBeltLoop.name = `belt_loops_extended_${i}`
        parts[`belt_loops_extended_${i}`] = extendedBeltLoop
        meshRef.current.add(extendedBeltLoop)
      }
    } else if (modelType === "sample-jacket") {
      // JACKET WITH ALL CUSTOMIZATIONS AND COLORS
      const baseColor = mainColor

      // Body
      const bodyGeometry = new THREE.BoxGeometry(2.2, 2.8, 0.4)
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: customizations.fabrictype === "velvet" ? 0.9 : customizations.fabrictype === "cashmere" ? 0.3 : 0.6,
        metalness: 0.1,
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.name = "jacket_body"
      parts["jacket_body"] = body
      meshRef.current.add(body)

      // LAPEL VARIATIONS with color support
      const lapelColor = customizations.accentColor || baseColor
      const lapelMaterial = new THREE.MeshStandardMaterial({
        color: lapelColor,
        roughness: 0.5,
      })

      // Notched lapels
      const notchedLapelGeometry = new THREE.BoxGeometry(0.6, 1, 0.1)
      const leftNotchedLapel = new THREE.Mesh(notchedLapelGeometry, lapelMaterial)
      leftNotchedLapel.position.set(-0.8, 0.8, 0.25)
      leftNotchedLapel.rotation.z = 0.3
      leftNotchedLapel.name = "lapel_notched_left"
      parts["lapel_notched_left"] = leftNotchedLapel
      meshRef.current.add(leftNotchedLapel)

      const rightNotchedLapel = new THREE.Mesh(notchedLapelGeometry, lapelMaterial)
      rightNotchedLapel.position.set(0.8, 0.8, 0.25)
      rightNotchedLapel.rotation.z = -0.3
      rightNotchedLapel.name = "lapel_notched_right"
      parts["lapel_notched_right"] = rightNotchedLapel
      meshRef.current.add(rightNotchedLapel)

      // Peak lapels - pointed
      const peakLapelGeometry = new THREE.ConeGeometry(0.3, 1.2, 3)
      const leftPeakLapel = new THREE.Mesh(peakLapelGeometry, lapelMaterial)
      leftPeakLapel.position.set(-0.8, 0.8, 0.25)
      leftPeakLapel.rotation.z = 0.5
      leftPeakLapel.name = "lapel_peak_left"
      parts["lapel_peak_left"] = leftPeakLapel
      meshRef.current.add(leftPeakLapel)

      const rightPeakLapel = new THREE.Mesh(peakLapelGeometry, lapelMaterial)
      rightPeakLapel.position.set(0.8, 0.8, 0.25)
      rightPeakLapel.rotation.z = -0.5
      rightPeakLapel.name = "lapel_peak_right"
      parts["lapel_peak_right"] = rightPeakLapel
      meshRef.current.add(rightPeakLapel)

      // Shawl lapels - rounded
      const shawlLapelGeometry = new THREE.CylinderGeometry(0.4, 0.3, 1.2, 8)
      const leftShawlLapel = new THREE.Mesh(shawlLapelGeometry, lapelMaterial)
      leftShawlLapel.position.set(-0.8, 0.8, 0.25)
      leftShawlLapel.rotation.z = 0.3
      leftShawlLapel.name = "lapel_shawl_left"
      parts["lapel_shawl_left"] = leftShawlLapel
      meshRef.current.add(leftShawlLapel)

      const rightShawlLapel = new THREE.Mesh(shawlLapelGeometry, lapelMaterial)
      rightShawlLapel.position.set(0.8, 0.8, 0.25)
      rightShawlLapel.rotation.z = -0.3
      rightShawlLapel.name = "lapel_shawl_right"
      parts["lapel_shawl_right"] = rightShawlLapel
      meshRef.current.add(rightShawlLapel)

      // BUTTON CONFIGURATIONS with color support
      const buttonColor = customizations.buttonColor || "#2C2C2C"
      const buttonMaterial = new THREE.MeshStandardMaterial({
        color: buttonColor,
        roughness: 0.2,
        metalness: 0.3,
      })

      const buttonGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.03, 8)

      // Single button
      const singleButton = new THREE.Mesh(buttonGeometry, buttonMaterial)
      singleButton.position.set(0, 0.2, 0.21)
      singleButton.name = "buttons_single"
      parts["buttons_single"] = singleButton
      meshRef.current.add(singleButton)

      // Two buttons
      for (let i = 0; i < 2; i++) {
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial)
        button.position.set(0, 0.4 - i * 0.4, 0.21)
        button.name = `buttons_double_${i}`
        parts[`buttons_double_${i}`] = button
        meshRef.current.add(button)
      }

      // Three buttons
      for (let i = 0; i < 3; i++) {
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial)
        button.position.set(0, 0.5 - i * 0.4, 0.21)
        button.name = `buttons_three_${i}`
        parts[`buttons_three_${i}`] = button
        meshRef.current.add(button)
      }

      // Four buttons
      for (let i = 0; i < 4; i++) {
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial)
        button.position.set(0, 0.6 - i * 0.3, 0.21)
        button.name = `buttons_four_${i}`
        parts[`buttons_four_${i}`] = button
        meshRef.current.add(button)
      }

      // VENT STYLES
      const ventMaterial = new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.7,
      })

      // Single vent
      const singleVentGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.05)
      const singleVent = new THREE.Mesh(singleVentGeometry, ventMaterial)
      singleVent.position.set(0, -0.8, -0.2)
      singleVent.name = "vent_single"
      parts["vent_single"] = singleVent
      meshRef.current.add(singleVent)

      // Double vents
      const leftVent = new THREE.Mesh(singleVentGeometry, ventMaterial)
      leftVent.position.set(-0.5, -0.8, -0.2)
      leftVent.name = "vent_double_left"
      parts["vent_double_left"] = leftVent
      meshRef.current.add(leftVent)

      const rightVent = new THREE.Mesh(singleVentGeometry, ventMaterial)
      rightVent.position.set(0.5, -0.8, -0.2)
      rightVent.name = "vent_double_right"
      parts["vent_double_right"] = rightVent
      meshRef.current.add(rightVent)

      // SLEEVES with color support
      const sleeveColor = customizations.sleeveColor || baseColor
      const sleeveGeometry = new THREE.CylinderGeometry(0.35, 0.3, 1.8, 8)
      const sleeveMaterial = new THREE.MeshStandardMaterial({
        color: sleeveColor,
        roughness: 0.6,
      })

      const leftSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial)
      leftSleeve.position.set(-1.4, 0.5, 0)
      leftSleeve.rotation.z = Math.PI / 2
      parts["sleeve_left"] = leftSleeve
      meshRef.current.add(leftSleeve)

      const rightSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial)
      rightSleeve.position.set(1.4, 0.5, 0)
      rightSleeve.rotation.z = -Math.PI / 2
      parts["sleeve_right"] = rightSleeve
      meshRef.current.add(rightSleeve)
    }

    setModelParts(parts)
  }, [modelType, customizations])

  // Apply ALL customizations and layer controls
  useEffect(() => {
    Object.entries(modelParts).forEach(([partName, mesh]) => {
      // Default to visible
      mesh.visible = true

      // Apply layer controls from customizations
      Object.entries(customizations).forEach(([customKey, customValue]) => {
        // Handle collar styles
        if (customKey === "collarstyle") {
          if (partName.includes("collar_")) {
            mesh.visible = partName.includes(`collar_${customValue}`)
          }
        }

        // Handle cuff styles
        if (customKey === "cuffstyle") {
          if (partName.includes("cuff_")) {
            mesh.visible = partName.includes(`cuff_${customValue}`)
          }
        }

        // Handle pocket styles
        if (customKey === "pocketstyle") {
          if (partName.includes("pocket")) {
            if (customValue === "none") {
              mesh.visible = false
            } else {
              mesh.visible = partName.includes(`pocket_${customValue}`) || partName.includes(`pockets_${customValue}`)
            }
          }
        }

        // Handle button styles
        if (customKey === "buttonstyle") {
          if (partName.includes("buttons_")) {
            mesh.visible = partName.includes(`buttons_${customValue}`)
          }
        }

        // Handle monogram
        if (customKey === "monogram") {
          if (partName.includes("monogram_")) {
            if (customValue === "none") {
              mesh.visible = false
            } else {
              mesh.visible = partName.includes(`monogram_${customValue}`)
            }
          }
        }

        // Handle fit styles (already handled in geometry creation)
        // Handle waistband styles (already handled in geometry creation)
        // Handle hem styles
        if (customKey === "hemstyle") {
          if (partName.includes("hem_")) {
            mesh.visible = partName.includes(`hem_${customValue}`)
          }
        }

        // Handle belt loops
        if (customKey === "beltloops") {
          if (partName.includes("belt_loops_")) {
            if (customValue === "none") {
              mesh.visible = false
            } else {
              mesh.visible = partName.includes(`belt_loops_${customValue}`)
            }
          }
        }

        // Handle lapel styles
        if (customKey === "lapelstyle") {
          if (partName.includes("lapel_")) {
            mesh.visible = partName.includes(`lapel_${customValue}`)
          }
        }

        // Handle button count
        if (customKey === "buttoncount") {
          if (partName.includes("buttons_")) {
            mesh.visible = partName.includes(`buttons_${customValue}`)
          }
        }

        // Handle vent styles
        if (customKey === "ventstyle") {
          if (partName.includes("vent_")) {
            if (customValue === "none") {
              mesh.visible = false
            } else {
              mesh.visible = partName.includes(`vent_${customValue}`)
            }
          }
        }
      })
    })
  }, [modelParts, customizations])

  // Rotate model slowly
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.2) * 0.1
    }
  })

  return <group ref={meshRef} />
}

// Loading component
function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-gray-600">Loading 3D Model...</div>
      </div>
    </Html>
  )
}

// Camera controller
function CameraController() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 2, 5)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return null
}

export function ModelViewer({
  modelUrl,
  customizations = {},
  layerControls = {},
  className = "w-full h-full",
}: ModelViewerProps) {
  const [error, setError] = useState<string | null>(null)

  // Map model URLs to types
  const getModelType = (url: string) => {
    if (url.includes("pants")) return "sample-pants"
    if (url.includes("jacket")) return "sample-jacket"
    return "sample-shirt"
  }

  const modelType = getModelType(modelUrl)

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100`}>
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <div className="text-gray-600">Failed to load 3D model</div>
          <div className="text-sm text-gray-500 mt-2">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <Canvas
        shadows
        camera={{ position: [0, 2, 5], fov: 50 }}
        style={{ background: "linear-gradient(to bottom, #f8fafc, #e2e8f0)" }}
      >
        <CameraController />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />

        {/* Environment */}
        <Environment preset="studio" />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
        />

        {/* 3D Model */}
        <Suspense fallback={<LoadingSpinner />}>
          <CustomizableModel modelType={modelType} customizations={customizations} layerControls={layerControls} />
        </Suspense>

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.1} />
        </mesh>
      </Canvas>
    </div>
  )
}
