class DestroyShelfTray
  prepend SimpleCommand

  def initialize(tray_id)
    @tray_id = tray_id
  end

  def call
    delete_tray_from_shelf
  end

  private

  def delete_tray_from_shelf
    tray = Tray.find(@tray_id)
    tray.delete
  end
end
