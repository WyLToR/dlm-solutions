using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Extensions;

public static class ControllerExtensions
{
    public static int GetUserId(this ControllerBase controller)
    {
        var userId = controller.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException("UserId claim missing.");

        return int.Parse(userId);
    }
}